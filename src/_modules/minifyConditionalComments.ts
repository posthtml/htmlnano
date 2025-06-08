import htmlnano from '../';
import { isConditionalComment } from '../helpers';
import type { HtmlnanoModule, HtmlnanoOptions, PostHTMLNodeLike, PostHTMLTreeLike } from '../types';

// Spec: https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/compatibility/ms537512(v=vs.85)
const CONDITIONAL_COMMENT_REGEXP = /(<!--\[if\s+?[^<>[\]]+?]>)([\s\S]+?)(<!\[endif\]-->)/gm;

async function minifyConditionalComments(tree: PostHTMLTreeLike, htmlnanoOptions: Partial<HtmlnanoOptions>): Promise<PostHTMLTreeLike>;
async function minifyConditionalComments(tree: PostHTMLNodeLike[], htmlnanoOptions: Partial<HtmlnanoOptions>): Promise<PostHTMLNodeLike[]>;
async function minifyConditionalComments(tree: PostHTMLTreeLike | PostHTMLNodeLike[], htmlnanoOptions: Partial<HtmlnanoOptions>) {
    // forEach, tree.walk, tree.match just don't support Promise.
    for (let i = 0, len = tree.length; i < len; i++) {
        const node = tree[i] as PostHTMLNodeLike;

        if (typeof node === 'string') {
            if (isConditionalComment(node)) {
                tree[i] = (await minifycontentInsideConditionalComments(node, htmlnanoOptions)) as PostHTMLNodeLike;
            }
        } else if (node.content && node.content.length) {
            node.content = await minifyConditionalComments(node.content, htmlnanoOptions);
        }
    }

    return tree;
}

/** Minify content inside conditional comments */
const mod: HtmlnanoModule = {
    default: minifyConditionalComments
};

export default mod;

async function minifycontentInsideConditionalComments(text: string, htmlnanoOptions: Partial<HtmlnanoOptions>) {
    let match;
    const matches = [];

    // FIXME!
    // String#matchAll is supported since Node.js 12
    while ((match = CONDITIONAL_COMMENT_REGEXP.exec(text)) !== null) {
        matches.push([match[1], match[2], match[3]]);
    }

    if (!matches.length) {
        return Promise.resolve(text);
    }

    return Promise.all(matches.map(async (match) => {
        const result = await htmlnano.process(match[1], htmlnanoOptions, {}, {});
        let minified = result.html;

        if (match[1].includes('<html') && minified.includes('</html>')) {
            minified = minified.replace('</html>', '');
        }

        return match[0] + minified + match[2];
    }));
}
