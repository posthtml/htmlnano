import type PostHTML from 'posthtml';
import { extractTextContentFromNode, isEventHandler, optionalImport } from '../helpers';
import type { HtmlnanoModule } from '../types';
import { redundantScriptTypes } from './removeRedundantAttributes.js';

import type { MinifyOptions } from 'terser';

/** Minify JS with Terser */
const mod: HtmlnanoModule<MinifyOptions> = {
    async default(tree, _, terserOptions) {
        const terser = await optionalImport<typeof import('terser')>('terser');

        if (!terser) return tree;

        const promises: (Promise<void> | void)[] = [];
        tree.walk((node) => {
            const nodeAttrs = node.attrs || {};

            /**
         * Skip SRI
         *
         * If the input <script /> has an SRI attribute, it means that the original <script /> could be trusted,
         * and should not be altered anymore.
         *
         * htmlnano is exactly an MITM that SRI is designed to protect from. If htmlnano or its dependencies get
         * compromised and introduces malicious code, then it is up to the original SRI to protect the end user.
         *
         * So htmlnano will simply skip <script /> that has SRI.
         * If developers do trust htmlnano, they should generate SRI after htmlnano modify the <script />.
         */
            if ('integrity' in nodeAttrs) {
                return node;
            }

            if (node.tag && node.tag === 'script') {
                const mimeType = nodeAttrs.type || 'text/javascript';
                if (redundantScriptTypes.has(mimeType) || mimeType === 'module') {
                    promises.push(processScriptNode(node, terserOptions, terser));
                }
            }

            if (node.attrs) {
                promises.push.apply(processNodeWithOnAttrs(node, terserOptions, terser));
            }

            return node;
        });

        return Promise.all(promises).then(() => tree);
    }
};

export default mod;

function stripCdata(js: string) {
    const leftStrippedJs = js.replace(/\/\/\s*<!\[CDATA\[/, '').replace(/\/\*\s*<!\[CDATA\[\s*\*\//, '');
    if (leftStrippedJs === js) {
        return js;
    }

    const strippedJs = leftStrippedJs.replace(/\/\/\s*\]\]>/, '').replace(/\/\*\s*\]\]>\s*\*\//, '');
    return leftStrippedJs === strippedJs ? js : strippedJs;
}

function processScriptNode(scriptNode: PostHTML.Node, terserOptions: MinifyOptions, terser: typeof import('terser')) {
    let js = extractTextContentFromNode(scriptNode).trim();
    if (!js.length) {
        return;
    }

    // Improve performance by avoiding calling stripCdata again and again
    let isCdataWrapped = false;
    if (js.includes('CDATA')) {
        const strippedJs = stripCdata(js);
        isCdataWrapped = js !== strippedJs;
        js = strippedJs;
    }

    return terser
        .minify(js, terserOptions)
        .then((result) => {
            if ('error' in result) {
                throw new Error(result.error as string);
            }

            if (result.code === undefined) {
                return;
            }

            let content = result.code;
            if (isCdataWrapped) {
                content = '/*<![CDATA[*/' + content + '/*]]>*/';
            }

            scriptNode.content = [content];
        });
}

function processNodeWithOnAttrs(node: PostHTML.Node, terserOptions: MinifyOptions, terser: typeof import('terser')) {
    const jsWrapperStart = 'a=function(){';
    const jsWrapperEnd = '};a();';

    const promises: Promise<void>[] = [];
    if (!node.attrs) {
        return promises;
    }

    for (const attrName in node.attrs) {
        if (!isEventHandler(attrName)) {
            continue;
        }

        const attrValue = node.attrs[attrName];
        if (typeof attrValue !== 'string') {
            continue;
        }

        // For example onclick="return false" is valid,
        // but "return false;" is invalid (error: 'return' outside of function)
        // Therefore the attribute's code should be wrapped inside function:
        // "function _(){return false;}"
        const wrappedJs = jsWrapperStart + node.attrs[attrName] + jsWrapperEnd;
        const promise = terser
            .minify(wrappedJs, terserOptions)
            .then(({ code }) => {
                if (code) {
                    const minifiedJs = code.substring(
                        jsWrapperStart.length,
                        code.length - jsWrapperEnd.length
                    );
                    node.attrs![attrName] = minifiedJs;
                }
            });
        promises.push(promise);
    }

    return promises;
}
