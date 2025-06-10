import type PostHTML from 'posthtml';
import { isComment } from '../helpers';
import type { HtmlnanoModule, PostHTMLNodeLike, PostHTMLTreeLike } from '../types';

const startWithWhitespacePattern = /^\s+/;

const bodyStartTagCantBeOmittedWithFirstChildTags = new Set(['meta', 'link', 'script', 'style']);
const tbodyStartTagCantBeOmittedWithPrecededTags = new Set(['tbody', 'thead', 'tfoot']);
const tbodyEndTagCantBeOmittedWithFollowedTags = new Set(['tbody', 'tfoot']);

function isEmptyTextNode(node: PostHTMLNodeLike) {
    if (typeof node === 'string' && node.trim() === '') {
        return true;
    }

    return false;
}

function isEmptyNode(node: PostHTML.Node) {
    if (!node.content) {
        return true;
    }

    if (node.content.length) {
        return !node.content.filter(n => typeof n === 'string' && isEmptyTextNode(n) ? false : true).length;
    }

    return true;
}

function getFirstChildTag(node: PostHTML.Node, nonEmpty = true) {
    if (node.content && node.content.length) {
        if (nonEmpty) {
            for (const childNode of node.content) {
                if (typeof childNode !== 'string') return childNode;
                if (!isEmptyTextNode(childNode)) return childNode;
            }
        } else {
            return node.content[0] || null;
        }
    }

    return null;
}

function getPrevNode(tree: PostHTMLTreeLike | PostHTMLNodeLike[], currentNodeIndex: number, nonEmpty = false) {
    if (nonEmpty) {
        for (let i = currentNodeIndex - 1; i >= 0; i--) {
            const node = tree[i];
            if (typeof node !== 'string' && node.tag) return node;
            if (!isEmptyTextNode(node)) return node;
        }
    } else {
        return tree[currentNodeIndex - 1] || null;
    }

    return null;
}

function getNextNode(tree: PostHTMLTreeLike | PostHTMLNodeLike[], currentNodeIndex: number, nonEmpty = false) {
    if (nonEmpty) {
        for (let i = currentNodeIndex + 1; i < tree.length; i++) {
            const node = tree[i];
            if (typeof node !== 'string') return node;
            if (!isEmptyTextNode(node)) return node;
        }
    } else {
        return tree[currentNodeIndex + 1] || null;
    }

    return null;
}

function removeOptionalTags(tree: PostHTMLTreeLike): PostHTMLTreeLike;
function removeOptionalTags(tree: PostHTMLNodeLike[]): PostHTMLNodeLike[];
function removeOptionalTags(tree: PostHTMLTreeLike | PostHTMLNodeLike[]) {
    tree.forEach((node, index) => {
        if (typeof node === 'string') return node;
        if (!node.tag) return node;

        if (node.attrs && Object.keys(node.attrs).length) return node;

        // const prevNode = getPrevNode(tree, index);
        const prevNonEmptyNode = getPrevNode(tree, index, true);
        const nextNode = getNextNode(tree, index);
        const nextNonEmptyNode = getNextNode(tree, index, true);
        const firstChildNode = getFirstChildTag(node, false);
        const firstNonEmptyChildNode = getFirstChildTag(node);

        /**
         * An "html" element's start tag may be omitted if the first thing inside the "html" element is not a comment.
         * An "html" element's end tag may be omitted if the "html" element is not IMMEDIATELY followed by a comment.
         */
        if (node.tag === 'html') {
            let isHtmlStartTagCanBeOmitted = true;
            let isHtmlEndTagCanBeOmitted = true;

            if (typeof firstNonEmptyChildNode === 'string' && isComment(firstNonEmptyChildNode)) {
                isHtmlStartTagCanBeOmitted = false;
            }

            if (typeof nextNonEmptyNode === 'string' && isComment(nextNonEmptyNode)) {
                isHtmlEndTagCanBeOmitted = false;
            }

            if (isHtmlStartTagCanBeOmitted && isHtmlEndTagCanBeOmitted) {
                // @ts-expect-error -- deliberately set tag to false
                node.tag = false;
            }
        }

        /**
         * A "head" element's start tag may be omitted if the element is empty, or if the first thing inside the "head" element is an element.
         * A "head" element's end tag may be omitted if the "head" element is not IMMEDIATELY followed by ASCII whitespace or a comment.
         */
        if (node.tag === 'head') {
            let isHeadStartTagCanBeOmitted = false;
            let isHeadEndTagCanBeOmitted = true;

            if (
                isEmptyNode(node)
                || (firstNonEmptyChildNode && typeof firstNonEmptyChildNode === 'object' && firstNonEmptyChildNode.tag)
            ) {
                isHeadStartTagCanBeOmitted = true;
            }

            if (
                (nextNode && typeof nextNode === 'string' && startWithWhitespacePattern.test(nextNode))
                || (nextNonEmptyNode && typeof nextNonEmptyNode === 'string' && isComment(nextNode))
            ) {
                isHeadEndTagCanBeOmitted = false;
            }

            if (isHeadStartTagCanBeOmitted && isHeadEndTagCanBeOmitted) {
                // @ts-expect-error -- deliberately set tag to false
                node.tag = false;
            }
        }

        /**
         * A "body" element's start tag may be omitted if the element is empty, or if the first thing inside the "body" element is not ASCII whitespace or a comment, except if the first thing inside the "body" element is a "meta", "link", "script", "style", or "template" element.
         * A "body" element's end tag may be omitted if the "body" element is not IMMEDIATELY followed by a comment.
         */
        if (node.tag === 'body') {
            let isBodyStartTagCanBeOmitted = true;
            let isBodyEndTagCanBeOmitted = true;

            if (
                (typeof firstChildNode === 'string' && startWithWhitespacePattern.test(firstChildNode))
                || (typeof firstNonEmptyChildNode === 'string' && isComment(firstNonEmptyChildNode))
            ) {
                isBodyStartTagCanBeOmitted = false;
            }

            if (firstNonEmptyChildNode && typeof firstNonEmptyChildNode === 'object' && firstNonEmptyChildNode.tag && bodyStartTagCantBeOmittedWithFirstChildTags.has(firstNonEmptyChildNode.tag)) {
                isBodyStartTagCanBeOmitted = false;
            }

            if (nextNode && typeof nextNode === 'string' && isComment(nextNode)) {
                isBodyEndTagCanBeOmitted = false;
            }

            if (isBodyStartTagCanBeOmitted && isBodyEndTagCanBeOmitted) {
                // @ts-expect-error -- deliberately set tag to false
                node.tag = false;
            }
        }

        /**
         * A "colgroup" element's start tag may be omitted if the first thing inside the "colgroup" element is a "col" element, and if the element is not IMMEDIATELY preceded by another "colgroup" element. It can't be omitted if the element is empty.
         * A "colgroup" element's end tag may be omitted if the "colgroup" element is not IMMEDIATELY followed by ASCII whitespace or a comment.
         */
        if (node.tag === 'colgroup') {
            let isColgroupStartTagCanBeOmitted = false;
            let isColgroupEndTagCanBeOmitted = true;

            if (firstNonEmptyChildNode && typeof firstNonEmptyChildNode === 'object' && firstNonEmptyChildNode.tag && firstNonEmptyChildNode.tag === 'col') {
                isColgroupStartTagCanBeOmitted = true;
            }

            if (prevNonEmptyNode && typeof prevNonEmptyNode === 'object' && prevNonEmptyNode.tag && prevNonEmptyNode.tag === 'colgroup') {
                isColgroupStartTagCanBeOmitted = false;
            }

            if (
                (nextNode && typeof nextNode === 'string' && startWithWhitespacePattern.test(nextNode))
                || (nextNonEmptyNode && typeof nextNonEmptyNode === 'string' && isComment(nextNonEmptyNode))
            ) {
                isColgroupEndTagCanBeOmitted = false;
            }

            if (isColgroupStartTagCanBeOmitted && isColgroupEndTagCanBeOmitted) {
                // @ts-expect-error -- deliberately set tag to false
                node.tag = false;
            }
        }

        /**
         * A "tbody" element's start tag may be omitted if the first thing inside the "tbody" element is a "tr" element, and if the element is not immediately preceded by another "tbody", "thead" or "tfoot" element. It can't be omitted if the element is empty.
         * A "tbody" element's end tag may be omitted if the "tbody" element is not IMMEDIATELY followed by a "tbody" or "tfoot" element.
         */
        if (node.tag === 'tbody') {
            let isTbodyStartTagCanBeOmitted = false;
            let isTbodyEndTagCanBeOmitted = true;

            if (firstNonEmptyChildNode && typeof firstNonEmptyChildNode === 'object' && firstNonEmptyChildNode.tag && firstNonEmptyChildNode.tag === 'tr') {
                isTbodyStartTagCanBeOmitted = true;
            }

            if (prevNonEmptyNode && typeof prevNonEmptyNode === 'object' && prevNonEmptyNode.tag && tbodyStartTagCantBeOmittedWithPrecededTags.has(prevNonEmptyNode.tag)) {
                isTbodyStartTagCanBeOmitted = false;
            }

            if (nextNonEmptyNode && typeof nextNonEmptyNode === 'object' && nextNonEmptyNode.tag && tbodyEndTagCantBeOmittedWithFollowedTags.has(nextNonEmptyNode.tag)) {
                isTbodyEndTagCanBeOmitted = false;
            }

            if (isTbodyStartTagCanBeOmitted && isTbodyEndTagCanBeOmitted) {
                // @ts-expect-error -- deliberately set tag to false
                node.tag = false;
            }
        }

        if (node.content && node.content.length) {
            removeOptionalTags(node.content);
        }

        return node;
    });

    return tree;
}

// Specification https://html.spec.whatwg.org/multipage/syntax.html#optional-tags
/** Remove optional tag in the DOM */
const mod: HtmlnanoModule = {
    default: removeOptionalTags
};

export default mod;
