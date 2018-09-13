import normalizeWhitespace from 'normalize-html-whitespace';
import { isComment } from '../helpers';

const noWhitespaceCollapseElements = new Set([
    'script',
    'style',
    'pre',
    'textarea'
]);

/** Collapses redundant whitespaces */
export default function collapseWhitespace(tree, options, collapseType) {
    if (collapseType !== 'conservative' && collapseType !== 'all') {
        collapseType = 'conservative';
    }

    tree.forEach((node, index) => {
        if (typeof node === 'string' && !isComment(node)) {
            node = collapseRedundantWhitespaces(node, collapseType, tree.walk !== undefined);
        }

        const isAllowCollapseWhitespace = !noWhitespaceCollapseElements.has(node.tag);
        if (node.content && node.content.length && isAllowCollapseWhitespace) {
            node.content = collapseWhitespace(node.content, options, collapseType);
        }

        tree[index] = node;
    });

    return tree;
}


function collapseRedundantWhitespaces(text, collapseType, isTopLevel = false) {
    text = text && text.length > 0 ? normalizeWhitespace(text) : '';
    if (collapseType === 'all' || isTopLevel) {
        text = text.trim();
    }

    return text;
}
