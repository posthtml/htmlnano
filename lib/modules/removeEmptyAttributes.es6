// Source: https://www.w3.org/TR/html4/sgml/dtd.html#events (Generic Attributes)
const safeToRemoveAttrs = [
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
];


/** Removes empty attributes */
export default function removeEmptyAttributes(tree) {
    tree.walk(node => {
        if (! node.attrs) {
            return node;
        }

        safeToRemoveAttrs.forEach(safeToRemoveAttr => {
            const attrValue = node.attrs[safeToRemoveAttr];
            if (attrValue === '' || (attrValue || '').match(/^\s+$/)) {
                delete node.attrs[safeToRemoveAttr];
            }
        });

        return node;
    });

    return tree;
}
