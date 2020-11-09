import htmlnano from '../htmlnano';
import { isConditionalComment } from '../helpers';

// Spec: https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/compatibility/ms537512(v=vs.85)
// FIXME: the eslint rule should be removed after ESLint fix the issue: https://github.com/eslint/eslint/issues/13826
// eslint-disable-next-line no-useless-escape
const CONDITIONAL_COMMENT_REGEXP = /(<!--\[if\s+?[^<>\[\]]+?]>)([\s\S]+?)(<!\[endif\]-->)/gm;

/** Minify content inside conditional comments */
export default async function minifyConditionalComments(tree, htmlnanoOptions) {
    // forEach, tree.walk, tree.match just don't support Promise.
    for (let i = 0, len = tree.length; i < len; i++) {
        const node = tree[i];

        if (typeof node === 'string' && isConditionalComment(node)) {
            tree[i] = await minifycontentInsideConditionalComments(node, htmlnanoOptions);
        }

        if (node.content && node.content.length) {
            tree[i].content = await minifyConditionalComments(node.content, htmlnanoOptions);
        }
    }

    return tree;
}

async function minifycontentInsideConditionalComments(text, htmlnanoOptions) {
    let match;
    const matches = [];

    while ((match = CONDITIONAL_COMMENT_REGEXP.exec(text)) !== null) {
        matches.push([match[1], match[2], match[3]]);
    }

    if (!matches.length) {
        return Promise.resolve(text);
    }

    return Promise.all(matches.map(async match => {
        const result = await htmlnano.process(match[1], htmlnanoOptions, {}, {});

        return match[0] + result.html + match[2];
    }));
}
