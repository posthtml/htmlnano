import { attributesWithLists } from './collapseAttributeWhitespace';

/** Deduplicate values inside list-like attributes (e.g. class, rel) */
export default function collapseAttributeWhitespace(tree) {
    tree.walk(node => {
        if (! node.attrs) {
            return node;
        }

        Object.keys(node.attrs).forEach(attrName => {
            const attrNameLower = attrName.toLowerCase();
            if (! attributesWithLists.has(attrNameLower)) {
                return;
            }

            const attrValues = node.attrs[attrName].split(/\s/);
            const uniqeAttrValues = new Set();
            const deduplicatedAttrValues = [];
            attrValues.forEach((attrValue) => {
                if (! attrValue) {
                    // Keep whitespaces
                    deduplicatedAttrValues.push('');
                    return;
                }

                if (uniqeAttrValues.has(attrValue)) {
                    return;
                }

                deduplicatedAttrValues.push(attrValue);
                uniqeAttrValues.add(attrValue);
            });

            node.attrs[attrName] = deduplicatedAttrValues.join(' ');
        });

        return node;
    });

    return tree;
}
