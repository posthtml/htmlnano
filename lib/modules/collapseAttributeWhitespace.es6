const attributesWithLists = new Set([
    'class',
    'rel',
]);


/** Collapse whitespaces inside list-like attributes (e.g. class, rel) */
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

            let attrValue = node.attrs[attrName].replace(/\s+/g, ' ').trim();
            node.attrs[attrName] = attrValue;
        });

        return node;
    });

    return tree;
}
