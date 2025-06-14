import { isStyleNode, extractCssFromStyleNode, optionalImport } from '../helpers';
import type {} from 'postcss';
import type { HtmlnanoModule } from '../types';
import type PostHTML from 'posthtml';
import type { Options as CssnanoOptions } from 'cssnano';

const postcssOptions = {
    // Prevent the following warning from being shown:
    // > Without `from` option PostCSS could generate wrong source map and will not find Browserslist config.
    // > Set it to CSS file path or to `undefined` to prevent this warning.
    from: undefined
};

/** Minify CSS with cssnano */
const mod: HtmlnanoModule<CssnanoOptions> = {
    async default(tree, _, cssnanoOptions) {
        const cssnano = await optionalImport<typeof import('cssnano')>('cssnano');
        const postcss = await optionalImport<typeof import('postcss').default>('postcss');

        if (!cssnano || !postcss) {
            return tree;
        }

        const promises: (Promise<void> | undefined)[] = [];
        tree.walk((node) => {
        // Skip SRI, reasons are documented in "minifyJs" module
            if (node.attrs && 'integrity' in node.attrs) {
                return node;
            }

            if (isStyleNode(node)) {
                promises.push(processStyleNode(node, cssnanoOptions, cssnano, postcss));
            } else if (node.attrs && node.attrs.style) {
                promises.push(processStyleAttr(node, cssnanoOptions, cssnano, postcss));
            }

            return node;
        });

        return Promise.all(promises).then(() => tree);
    }
};

export default mod;

function processStyleNode(styleNode: PostHTML.Node, cssnanoOptions: CssnanoOptions, cssnano: typeof import('cssnano'), postcss: typeof import('postcss').default) {
    let css = extractCssFromStyleNode(styleNode);
    if (!css) return;

    // Improve performance by avoiding calling stripCdata again and again
    let isCdataWrapped = false;
    if (css.includes('CDATA')) {
        const strippedCss = stripCdata(css);
        isCdataWrapped = css !== strippedCss;
        css = strippedCss;
    }

    return postcss([cssnano(cssnanoOptions)])
        .process(css, postcssOptions)
        .then((result) => {
            if (isCdataWrapped) {
                styleNode.content = ['<![CDATA[' + result.toString() + ']]>'];
            } else {
                styleNode.content = [result.css];
            }
        });
}

function processStyleAttr(node: PostHTML.Node, cssnanoOptions: CssnanoOptions, cssnano: typeof import('cssnano'), postcss: typeof import('postcss').default) {
    // CSS "color: red;" is invalid. Therefore it should be wrapped inside some selector:
    // a{color: red;}
    const wrapperStart = 'a{';
    const wrapperEnd = '}';

    if (!node.attrs || !node.attrs.style) {
        return;
    }

    const wrappedStyle = wrapperStart + (node.attrs.style || '') + wrapperEnd;

    return postcss([cssnano(cssnanoOptions)])
        .process(wrappedStyle, postcssOptions)
        .then((result) => {
            const minifiedCss = result.css;
            // Remove wrapperStart at the start and wrapperEnd at the end of minifiedCss
            node.attrs!.style = minifiedCss.substring(
                wrapperStart.length,
                minifiedCss.length - wrapperEnd.length
            );
        });
}

function stripCdata(css: string) {
    const leftStrippedCss = css.replace('<![CDATA[', '');
    if (leftStrippedCss === css) {
        return css;
    }

    const strippedCss = leftStrippedCss.replace(']]>', '');
    return leftStrippedCss === strippedCss ? css : strippedCss;
}
