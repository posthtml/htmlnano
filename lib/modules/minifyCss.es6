import { isAmpBoilerplate } from '../helpers';
import cssnano from 'cssnano';

const postcssOptions = {
    // Prevent the following warning from being shown:
    // > Without `from` option PostCSS could generate wrong source map and will not find Browserslist config.
    // > Set it to CSS file path or to `undefined` to prevent this warning.
    from: undefined,
};

/** Minify CSS with cssnano */
export default function minifyCss(tree, options, cssnanoOptions) {
    let promises = [];
    tree.walk(node => {
        if (isStyleNode(node)) {
            promises.push(processStyleNode(node, cssnanoOptions));
        } else if (node.attrs && node.attrs.style) {
            promises.push(processStyleAttr(node, cssnanoOptions));
        }

        return node;
    });

    return Promise.all(promises).then(() => tree);
}


function isStyleNode(node) {
    return node.tag === 'style' && !isAmpBoilerplate(node) && node.content && node.content.length;
}


function processStyleNode(styleNode, cssnanoOptions) {
    const css = Array.isArray(styleNode.content) ? styleNode.content.join(' ') : styleNode.content;
    return cssnano
        .process(css, postcssOptions, cssnanoOptions)
        .then(result => styleNode.content = [result.css]);
}


function processStyleAttr(node, cssnanoOptions) {
    // CSS "color: red;" is invalid. Therefore it should be wrapped inside some selector:
    // a{color: red;}
    const wrapperStart = 'a{';
    const wrapperEnd = '}';
    const wrappedStyle = wrapperStart + (node.attrs.style || '') + wrapperEnd;

    return cssnano
        .process(wrappedStyle, postcssOptions, cssnanoOptions)
        .then(result => {
            const minifiedCss = result.css;
            // Remove wrapperStart at the start and wrapperEnd at the end of minifiedCss
            node.attrs.style = minifiedCss.substring(
                wrapperStart.length,
                minifiedCss.length - wrapperEnd.length
            );
        });
}
