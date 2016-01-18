const noWhitespaceCollapseElements = ['script', 'style', 'pre', 'textarea'];


/** Collapses redundant whitespaces */
export default function collapseWhitespace(tree, options, collapseType) {
    if (collapseType !== 'all' && collapseType !== 'conservative') {
        collapseType = 'all';
    }

    tree.forEach((node, index) => {
        if (typeof node === 'string') {
            node = collapseRedundantWhitespaces(node, collapseType);
        }

        const isAllowCollapseWhitespace = noWhitespaceCollapseElements.indexOf(node.tag) === -1;
        if (node.content && node.content.length && isAllowCollapseWhitespace) {
            node.content = collapseWhitespace(node.content, options, collapseType);
        }

        tree[index] = node;
    });

    return tree;
}


function collapseRedundantWhitespaces(text, collapseType) {
    text = (text || '').replace(/\s+/g, ' ');
    if (collapseType === 'all') {
        text = text.trim();
    }

    return text;
}
