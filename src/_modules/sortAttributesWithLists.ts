// class, rel, ping
import type { HtmlnanoModule, PostHTMLTreeLike } from '../types';
import { attributesWithLists } from './collapseAttributeWhitespace';

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

    addFromNodeAttrsArray(attrValuesArray: string[]) {
        attrValuesArray.forEach((attrValue) => {
            if (this.freqData.has(attrValue)) {
                this.freqData.set(attrValue, this.freqData.get(attrValue)! + 1);
            } else {
                this.freqData.set(attrValue, 1);
            }
        });
    }

    createSortOrder() {
        const _sortOrder = [...this.freqData.entries()];
        _sortOrder.sort((a, b) => b[1] - a[1]);

        this.sortOrder = _sortOrder.map(i => i[0]);
    }

    sortFromNodeAttrsArray(attrValuesArray: string[]) {
        const resultArray: string[] = [];

        if (!this.sortOrder) {
            this.createSortOrder();
        }

        this.sortOrder!.forEach((k) => {
            if (attrValuesArray.includes(k)) {
                resultArray.push(k);
            }
        });

        return resultArray;
    }
}

/** Sort values inside list-like attributes (e.g. class, rel) */
const mod: HtmlnanoModule<boolean | 'alphabetical' | 'frequency'> = {
    default(tree, options, moduleOptions) {
        const sortType = processModuleOptions(moduleOptions);

        if (sortType === 'alphabetical') {
            return sortAttributesWithListsInAlphabeticalOrder(tree);
        }

        if (sortType === 'frequency') {
            return sortAttributesWithListsByFrequency(tree);
        }

        // Invalid configuration
        return tree;
    }
};

export default mod;

function sortAttributesWithListsInAlphabeticalOrder(tree: PostHTMLTreeLike) {
    tree.walk((node) => {
        if (!node.attrs) {
            return node;
        }

        Object.keys(node.attrs).forEach((attrName) => {
            const attrNameLower = attrName.toLowerCase();
            if (!attributesWithLists.has(attrNameLower)) {
                return;
            }

            const attrValues = node.attrs![attrName]!.split(/\s/);

            node.attrs![attrName] = attrValues.sort((a, b) => {
                // @ts-expect-error -- deliberately use minus operator to sort things
                return typeof a.localeCompare === 'function' ? a.localeCompare(b) : a - b;
            }).join(' ');
        });

        return node;
    });

    return tree;
}

function sortAttributesWithListsByFrequency(tree: PostHTMLTreeLike) {
    const tokenChainObj: Record<string, AttributeTokenChain> = {}; // <attrNameLower: AttributeTokenChain>[]

    // Traverse through tree to get frequency
    tree.walk((node) => {
        if (!node.attrs) {
            return node;
        }

        Object.entries(node.attrs).forEach(([attrName, attrValues]) => {
            const attrNameLower = attrName.toLowerCase();

            if (!attributesWithLists.has(attrNameLower)) {
                return;
            }

            tokenChainObj[attrNameLower] = tokenChainObj[attrNameLower] || new AttributeTokenChain();
            tokenChainObj[attrNameLower].addFromNodeAttrsArray(attrValues!.split(/\s/));
        });

        return node;
    });

    // Traverse through tree again, this time sort the attribute values
    tree.walk((node) => {
        if (!node.attrs) {
            return node;
        }

        Object.entries(node.attrs).forEach(([attrName, attrValues]) => {
            const attrNameLower = attrName.toLowerCase();

            if (!attributesWithLists.has(attrNameLower)) {
                return;
            }

            if (tokenChainObj[attrNameLower]) {
                node.attrs![attrName] = tokenChainObj[attrNameLower].sortFromNodeAttrsArray(attrValues!.split(/\s/)).join(' ');
            }
        });

        return node;
    });

    return tree;
}
