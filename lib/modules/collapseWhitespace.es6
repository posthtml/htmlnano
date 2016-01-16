const noWhitespaceCollapseElements = ['script', 'style', 'pre', 'textarea'];


/** Collapses redundant whitespaces */
export default function collapseWhitespace(tree) {
    tree.forEach((node, index) => {
        if (typeof node === 'string') {
            node = collapseRedundantWhitespaces(node);
        }

        const isAllowCollapseWhitespace = noWhitespaceCollapseElements.indexOf(node.tag) === -1;
        if (node.content && node.content.length && isAllowCollapseWhitespace) {
            node.content = collapseWhitespace(node.content);
        }

        tree[index] = node;
    });

    return tree;
}


function collapseRedundantWhitespaces(text) {
    // Find all whitespaces except \r and \n
    return (text || '').replace(/[^\S\r\n]{2,}/g, ' ').trim();
}
