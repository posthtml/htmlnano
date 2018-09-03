// Source: https://www.w3.org/TR/html4/sgml/dtd.html#events (Generic Attributes)
const safeToRemoveAttrs = new Set([
    'id',
    'class',
    'style',
    'title',
    'lang',
    'dir',
    'onclick',
    'ondblclick',
    'onmousedown',
    'onmouseup',
    'onmouseover',
    'onmousemove',
    'onmouseout',
    'onkeypress',
    'onkeydown',
    'onkeyup'
]);


/** Removes empty attributes */
export default function removeEmptyAttributes(tree) {
    tree.walk(node => {
        if (! node.attrs) {
            return node;
        }

        Object.keys(node.attrs).forEach(attrName => {
            const attrNameLower = attrName.toLowerCase();
            if (!safeToRemoveAttrs.has(attrNameLower)) {
                return;
            }

            const attrValue = node.attrs[attrName];
            if (attrValue === '' || (attrValue || '').match(/^\s+$/)) {
                delete node.attrs[attrName];
            }
        });

        return node;
    });

    return tree;
}
