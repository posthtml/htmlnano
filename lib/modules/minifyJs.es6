import terser from 'terser';
import { redundantScriptTypes } from './removeRedundantAttributes';


/** Minify JS with Terser */
export default function minifyJs(tree, options, terserOptions) {
    tree.walk(node => {
        if (node.tag && node.tag === 'script') {
            const nodeAttrs = node.attrs || {};
            const mimeType = nodeAttrs.type || 'text/javascript';
            if (redundantScriptTypes.has(mimeType) || mimeType === 'module') {
                node = processScriptNode(node, terserOptions);
            }
        }

        if (node.attrs) {
            node = processNodeWithOnAttrs(node, terserOptions);
        }

        return node;
    });

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


function processScriptNode(scriptNode, terserOptions) {
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

    const result = terser.minify(js, terserOptions);
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


function processNodeWithOnAttrs(node, terserOptions) {
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
        let wrappedMinifiedJs = terser.minify(wrappedJs, terserOptions).code;
        let minifiedJs = wrappedMinifiedJs.substring(
            jsWrapperStart.length,
            wrappedMinifiedJs.length - jsWrapperEnd.length
        );
        node.attrs[attrName] = minifiedJs;
    }

    return node;
}
