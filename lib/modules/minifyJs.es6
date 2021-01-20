import terser from 'terser';
import { redundantScriptTypes } from './removeRedundantAttributes';


/** Minify JS with Terser */
export default function minifyJs(tree, options, terserOptions) {
    const promises = tree.map(function(node, i) {
        return Promise.resolve(node)
            .then(function() {
                if (node.tag && node.tag === 'script') {
                    const nodeAttrs = node.attrs || {};
                    const mimeType = nodeAttrs.type || 'text/javascript';
                    if (redundantScriptTypes.has(mimeType)) {
                        return processScriptNode(tree[i], terserOptions);
                    }
                }
                return node;
            })
            .then(function(node) {
                if (node.attrs) {
                    return processNodeWithOnAttrs(tree[i], terserOptions);
                }
                return node;
            })
            .then(function(node) {
                if (node.content && node.content.length) {
                    return minifyJs(tree[i].content, options, terserOptions)
                        .then(content => {
                            node.content = content;
                            return node;
                        });
                }
                return node;
            })
            .then(function(node) {
                tree[i] = node;
            });
    });

    return Promise.all(promises).then(() => tree);
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

    return terser.minify(js, terserOptions)
        .then(result => {
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
        });
}


function processNodeWithOnAttrs(node, terserOptions) {
    const jsWrapperStart = 'function _(){';
    const jsWrapperEnd = '}';

    const promises = Object.keys(node.attrs || {}).map(attrName => {
        if (!attrName.startsWith('on')) {
            return;
        }

        // For example onclick="return false" is valid,
        // but "return false;" is invalid (error: 'return' outside of function)
        // Therefore the attribute's code should be wrapped inside function:
        // "function _(){return false;}"
        let wrappedJs = jsWrapperStart + node.attrs[attrName] + jsWrapperEnd;
        return terser.minify(wrappedJs, terserOptions)
            .then(function({ code: wrappedMinifiedJs }) {
                let minifiedJs = wrappedMinifiedJs.substring(
                    jsWrapperStart.length,
                    wrappedMinifiedJs.length - jsWrapperEnd.length
                );
                node.attrs[attrName] = minifiedJs;
            });
    });

    return Promise.all(promises).then(() => node);
}
