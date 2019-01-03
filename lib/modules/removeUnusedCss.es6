import { isStyleNode, extractCssFromStyleNode } from '../helpers';
import uncss from 'uncss';
import render from 'posthtml-render';


// These options must be set and shouldn't be overriden to ensure uncss doesn't look at linked stylesheets.
const uncssOptions = {
    ignoreSheets: [/\s*/],
    stylesheets: [],
};

/** Remove unused CSS using uncss */
export default function removeUnusedCss(tree, options, uncssOptions) {
    let promises = [];
    const html = render(tree);
    tree.walk(node => {
        if (isStyleNode(node)) {
            promises.push(processStyleNode(html, node, uncssOptions));
        }
        return node;
    });

    return Promise.all(promises).then(() => tree);
}


function processStyleNode(html, styleNode, uncssOptions) {
    const css = extractCssFromStyleNode(styleNode);

    return runUncss(html, css, uncssOptions).then(css => {
        // uncss may have left some style tags empty
        if (css.trim().length === 0) {
            styleNode.tag = false;
            styleNode.content = [];
            return;
        }
        styleNode.content = [css];
    });
}


function runUncss(html, css, userOptions) {
    if (typeof userOptions !== 'object') {
        userOptions = {};
    }

    const options = Object.assign({}, userOptions, uncssOptions);
    return new Promise((resolve, reject) => {
        options.raw = css;
        uncss(html, options, (error, output) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(output);
        });
    });
}
