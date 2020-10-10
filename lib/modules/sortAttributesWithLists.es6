import { attributesWithLists } from './collapseAttributeWhitespace';

/** Sort values inside list-like attributes (e.g. class, rel) */
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

            node.attrs[attrName] = attrValues.sort().join(' ');
        });

        return node;
    });

    return tree;
}
