import { isComment } from '../helpers';

const noWhitespaceCollapseElements = new Set([
    'script',
    'style',
    'pre',
    'textarea'
]);

const indentPattern = /[\f\n\r\t\v]{1,}/g;
const whitespacePattern = /[\f\n\r\t\v ]{1,}/g;
const NONE = '';
const SINGLE_SPACE = ' ';
const validOptions = ['all', 'aggressive', 'conservative'];

/** Collapses redundant whitespaces */
export default function collapseWhitespace(tree, options, collapseType, tag) {
    collapseType = (collapseType && validOptions.some(o=>o === collapseType)) ? collapseType : 'conservative';

    tree.forEach((node, index) => {
        if (typeof node === 'string' && !isComment(node)) {
            const isTopLevel = ! tag || tag === 'html' || tag === 'head';
            node = collapseRedundantWhitespaces(node, collapseType, isTopLevel);
        }

        const isAllowCollapseWhitespace = !noWhitespaceCollapseElements.has(node.tag);
        if (node.content && node.content.length && isAllowCollapseWhitespace) {
            node.content = collapseWhitespace(node.content, options, collapseType, node.tag);
        }

        tree[index] = node;
    });

    return tree;
}


function collapseRedundantWhitespaces(text, collapseType, isTopLevel = false) {
    if (!text || text.length === 0) {
        return NONE;
    }

    if (collapseType === 'aggressive') {
        text = text.replace(indentPattern, NONE);
    }

    text = text.replace(whitespacePattern, SINGLE_SPACE);

    if (collapseType === 'all' || isTopLevel) {
        text = text.trim();
    }

    return text;
}