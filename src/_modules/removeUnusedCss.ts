import type PostHTML from 'posthtml';
import { isStyleNode, extractCssFromStyleNode, optionalImport } from '../helpers';
import type { HtmlnanoModule, PostHTMLTreeLike } from '../types';
import type { Options as PurgeCSSOptions } from 'purgecss';

// These options must be set and shouldn't be overriden to ensure uncss doesn't look at linked stylesheets.
const uncssOptions = {
    ignoreSheets: [/\s*/],
    stylesheets: []
};

function processStyleNodeUnCSS(html: string, styleNode: PostHTML.Node, uncssOptions: object, uncss: any) {
    const css = extractCssFromStyleNode(styleNode)!;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- uncss no types
    return runUncss(html, css, uncssOptions, uncss).then((css) => {
        // uncss may have left some style tags empty
        if (css.trim().length === 0) {
            // @ts-expect-error -- explicitly remove the tag
            styleNode.tag = false;
            styleNode.content = [];
            return;
        }
        styleNode.content = [css];
    });
}

function runUncss(html: string, css: string, userOptions: object, uncss: (...args: any[]) => void) {
    if (typeof userOptions !== 'object') {
        userOptions = {};
    }

    const options: object = { ...userOptions, ...uncssOptions };

    return new Promise<string>((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access -- we dont have uncss types
        (options as any).raw = css;
        uncss(html, options, (error: Error, output: string) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(output);
        });
    });
}

const purgeFromHtml = function (tree: PostHTMLTreeLike) {
    // content is not used as we can directly used the parsed HTML,
    // making the process faster
    const selectors: string[] = [];

    tree.walk((node) => {
        const classes = node.attrs && node.attrs.class && node.attrs.class.split(' ') || [];
        const ids = node.attrs && node.attrs.id && node.attrs.id.split(' ') || [];
        selectors.push(...classes, ...ids);
        if (node.tag) {
            selectors.push(node.tag);
        }
        return node;
    });

    return () => selectors;
};

function processStyleNodePurgeCSS(tree: PostHTMLTreeLike, styleNode: PostHTML.Node, purgecssOptions: object, purgecss: typeof import('purgecss')) {
    const css = extractCssFromStyleNode(styleNode)!;
    return runPurgecss(tree, css, purgecssOptions, purgecss)
        .then((css) => {
            if (css.trim().length === 0) {
                // @ts-expect-error -- explicitly remove the tag
                styleNode.tag = false;
                styleNode.content = [];
                return;
            }
            styleNode.content = [css];
        });
}

function runPurgecss(tree: PostHTMLTreeLike, css: string, userOptions: Partial<PurgeCSSOptions>, purgecss: typeof import('purgecss')) {
    if (typeof userOptions !== 'object') {
        userOptions = {};
    }

    const options: PurgeCSSOptions = {
        ...userOptions,
        content: [{
            raw: tree.render(),
            extension: 'html'
        }],
        css: [{
            raw: css,
            // @ts-expect-error -- old purgecss options
            extension: 'css'
        }],
        extractors: [{
            extractor: purgeFromHtml(tree),
            extensions: ['html']
        }]
    };

    return new purgecss.PurgeCSS()
        .purge(options)
        .then((result) => {
            return result[0].css;
        });
}

export interface RemoveUnusedCssOptions {
    tool?: 'purgeCSS' | 'uncss';
}

/** Remove unused CSS */
const mod: HtmlnanoModule<RemoveUnusedCssOptions> = {
    async default(tree, options, userOptions) {
        const promises: Promise<unknown>[] = [];

        let html: string;

        const purgecss = await optionalImport<typeof import('purgecss')>('purgecss');
        const uncss = await optionalImport('uncss');

        tree.walk((node) => {
            if (isStyleNode(node)) {
                if (userOptions.tool === 'purgeCSS') {
                    if (purgecss) {
                        promises.push(processStyleNodePurgeCSS(tree, node, userOptions, purgecss));
                    }
                } else {
                    if (uncss) {
                        html ??= tree.render(tree);
                        promises.push(processStyleNodeUnCSS(html, node, userOptions, uncss));
                    }
                }
            }
            return node;
        });

        return Promise.all(promises).then(() => tree);
    }
};

export default mod;
