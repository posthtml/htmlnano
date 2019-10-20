import { isStyleNode, extractCssFromStyleNode } from '../helpers';
import Purgecss from 'purgecss';

const purgeFromHtml = function (tree) {
    // content is not used as we can directly used the parsed HTML,
    // making the process faster
    const selectors = [];

    tree.walk(node => {
        const classes = node.attrs && node.attrs.class && node.attrs.class.split(' ') || [];
        const ids = node.attrs && node.attrs.id && node.attrs.id.split(' ') || [];
        selectors.push(...classes, ...ids);
        node.tag && selectors.push(node.tag);
        return node;
    });

    return () => selectors;
};

export default function removeUnusedCss(tree, options, purgecssOptions) {
    let promises = [];
    tree.walk(node => {
        if (isStyleNode(node)) {
            promises.push(processStyleNode(tree, node, purgecssOptions));
        }
        return node;
    });

    return Promise.all(promises).then(() => tree);
}

function processStyleNode(tree, styleNode, purgecssOptions) {
    const css = extractCssFromStyleNode(styleNode);
    return runPurgecss(tree, css, purgecssOptions)
        .then(css => {
            if (css.trim().length === 0) {
                styleNode.tag = false;
                styleNode.content = [];
                return;
            }
            styleNode.content = [css];
        });
}

function runPurgecss(tree, css, userOptions) {
    if (typeof userOptions !== 'object') {
        userOptions = {};
    }

    const options = Object.assign({}, userOptions, {
        content: [{
            raw: tree,
            extension: 'html'
        }],
        css: [{
            raw: css,
            extension: 'css'
        }],
        extractors: [{
            extractor: purgeFromHtml(tree),
            extensions: ['html']
        }]
    });

    return new Promise((resolve, reject) => {
        try {
            const purgeCss = new Purgecss(options);
            const purgecssResult = purgeCss.purge()[0];
            resolve(purgecssResult.css);
        } catch (err) {
            reject(err);
        }
    });
}
