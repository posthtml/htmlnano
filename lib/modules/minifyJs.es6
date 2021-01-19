import terser from 'terser';
import { redundantScriptTypes } from './removeRedundantAttributes';


/** Minify JS with Terser */
export default async function minifyJs(tree, options, terserOptions) {
    for (let i = 0, len = tree.length; i < len; i++) {
        const node = tree[i];

        if (node.tag && node.tag === 'script') {
            const nodeAttrs = node.attrs || {};
            const mimeType = nodeAttrs.type || 'text/javascript';
            if (redundantScriptTypes.has(mimeType)) {
                tree[i] = await processScriptNode(node, terserOptions);
            }
        }

        if (node.attrs) {
            tree[i] = await processNodeWithOnAttrs(node, terserOptions);
        }

        if (node.content && node.content.length) {
            tree[i].content = await minifyJs(node.content, options, terserOptions);
        }
    }

    return tree;
}


function stripCdata(js) {
    const leftStrippedJs = js.replace(/\/\/\s*<!\[CDATA\[/, '').replace(/\/\*\s*<!\[CDATA\[\s*\*\//, '');
    if (leftStrippedJs === js) {
        return js;
    }

    const strippedJs = leftStrippedJs.replace(/\/\/\s*\]\]>/, '').replace(/\/\*\s*\]\]>\s*\*\//, '');
    return leftStrippedJs === strippedJs ? js : strippedJs;
}


async function processScriptNode(scriptNode, terserOptions) {
    let js = (scriptNode.content || []).join('').trim();
    if (!js) {
        return scriptNode;
    }

    // Improve performance by avoiding calling stripCdata again and again
    let isCdataWrapped = false;
    if (js.includes('CDATA')) {
        const strippedJs = stripCdata(js);
        isCdataWrapped = js !== strippedJs;
        js = strippedJs;
    }

    const result = await terser.minify(js, terserOptions);
    if (result.error) {
        throw new Error(result.error);
    }
    if (result.code === undefined) {
        return scriptNode;
    }

    let content = result.code;
    if (isCdataWrapped) {
        content = '/*<![CDATA[*/' + content + '/*]]>*/';
    }

    scriptNode.content = [content];

    return scriptNode;
}


async function processNodeWithOnAttrs(node, terserOptions) {
    const jsWrapperStart = 'function _(){';
    const jsWrapperEnd = '}';

    for (const attrName of Object.keys(node.attrs || {})) {
        if (!attrName.startsWith('on')) {
            continue;
        }

        // For example onclick="return false" is valid,
        // but "return false;" is invalid (error: 'return' outside of function)
        // Therefore the attribute's code should be wrapped inside function:
        // "function _(){return false;}"
        let wrappedJs = jsWrapperStart + node.attrs[attrName] + jsWrapperEnd;
        let { code: wrappedMinifiedJs } = await terser.minify(wrappedJs, terserOptions);
        let minifiedJs = wrappedMinifiedJs.substring(
            jsWrapperStart.length,
            wrappedMinifiedJs.length - jsWrapperEnd.length
        );
        node.attrs[attrName] = minifiedJs;
    }

    return node;
}
