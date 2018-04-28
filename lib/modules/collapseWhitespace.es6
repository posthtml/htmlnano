import { isComment } from '../helpers';

const noWhitespaceCollapseElements = ['script', 'style', 'pre', 'textarea'];

/** Collapses redundant whitespaces */
export default function collapseWhitespace(tree, options, collapseType) {
    if (collapseType !== 'conservative' && collapseType !== 'all') {
        collapseType = 'conservative';
    }
    
    tree.forEach((node, index) => {
        if (typeof node === 'string' && !isComment(node)) {
            node = collapseRedundantWhitespaces(node, collapseType, tree.walk !== undefined);
        }

        const isAllowCollapseWhitespace = noWhitespaceCollapseElements.indexOf(node.tag) === -1;
        if (node.content && node.content.length && isAllowCollapseWhitespace) {
            node.content = collapseWhitespace(node.content, options, collapseType);
        }

        tree[index] = node;
    });

    return tree;
}


function collapseRedundantWhitespaces(text, collapseType, isTopLevel = false) {
    text = text && text.length > 0 ? text.replace(/\s+/g, ' ') : '';
    if (collapseType === 'all' || isTopLevel) {
        text = text.trim();
    }

    return text;
}
