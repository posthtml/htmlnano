import type { HtmlnanoModule, PostHTMLTreeLike } from '../types';

type ValidOptions = 'alphabetical' | 'frequency';
const validOptions = new Set(['frequency', 'alphabetical']);

const processModuleOptions = (options: boolean | ValidOptions): ValidOptions | false => {
    if (options === true) return 'alphabetical';
    if (options === false) return false;

    return validOptions.has(options) ? options : false;
};

class AttributeTokenChain {
    /** <attr, frequency> */
    freqData = new Map<string, number>();
    sortOrder: string[] | null = null;

    addFromNodeAttrs(nodeAttrs: Record<string, string | void>) {
        Object.keys(nodeAttrs).forEach((attrName) => {
            const attrNameLower = attrName.toLowerCase();

            if (this.freqData.has(attrNameLower)) {
                this.freqData.set(attrNameLower, this.freqData.get(attrNameLower)! + 1);
            } else {
                this.freqData.set(attrNameLower, 1);
            }
        });
    }

    createSortOrder() {
        const _sortOrder = [...this.freqData.entries()];
        _sortOrder.sort((a, b) => b[1] - a[1]);

        this.sortOrder = _sortOrder.map(i => i[0]);
    }

    sortFromNodeAttrs(nodeAttrs: Record<string, string | void>) {
        const newAttrs: Record<string, string | void> = {};

        // Convert node.attrs attrName into lower case.
        const loweredNodeAttrs: Record<string, string | void> = {};
        Object.entries(nodeAttrs).forEach(([attrName, attrValue]) => {
            loweredNodeAttrs[attrName.toLowerCase()] = attrValue;
        });

        if (!this.sortOrder) {
            this.createSortOrder();
        }

        this.sortOrder!.forEach((attrNameLower) => {
            // The attrName inside "sortOrder" has been lowered
            if (loweredNodeAttrs[attrNameLower] != null) {
                newAttrs[attrNameLower] = loweredNodeAttrs[attrNameLower];
            }
        });

        return newAttrs;
    }
}

/** Sort attibutes */
const mod: HtmlnanoModule<boolean | ValidOptions> = {
    default(tree, options, moduleOptions) {
        const sortType = processModuleOptions(moduleOptions);

        if (sortType === 'alphabetical') {
            return sortAttributesInAlphabeticalOrder(tree);
        }

        if (sortType === 'frequency') {
            return sortAttributesByFrequency(tree);
        }

        // Invalid configuration
        return tree;
    }
};

export default mod;

function sortAttributesInAlphabeticalOrder(tree: PostHTMLTreeLike) {
    tree.walk((node) => {
        if (!node.attrs) {
            return node;
        }

        const newAttrs: Record<string, string | void> = {};

        Object.keys(node.attrs)
            // @ts-expect-error -- deliberately use minus operator to sort things
            .sort((a, b) => typeof a.localeCompare === 'function' ? a.localeCompare(b) : a - b)
            .forEach((attr) => {
                newAttrs[attr] = node.attrs![attr];
            });

        node.attrs = newAttrs;

        return node;
    });

    return tree;
}

function sortAttributesByFrequency(tree: PostHTMLTreeLike) {
    const tokenchain = new AttributeTokenChain();

    // Traverse through tree to get frequency
    tree.walk((node) => {
        if (!node.attrs) {
            return node;
        }

        tokenchain.addFromNodeAttrs(node.attrs);

        return node;
    });

    // Traverse through tree again, this time sort the attributes
    tree.walk((node) => {
        if (!node.attrs) {
            return node;
        }

        node.attrs = tokenchain.sortFromNodeAttrs(node.attrs);

        return node;
    });

    return tree;
}
