import uglifyJs from 'uglify-js';


/** Minify JS with UglifyJS */
export default function minifyJs(tree, options, uglifyJsOptions) {

    tree.match({tag: 'script'}, node => {
        const nodeAttrs = node.attrs || {};
        const mimeType = nodeAttrs.type || 'text/javascript';
        if (mimeType === 'text/javascript' || mimeType === 'application/javascript') {
            return processScriptNode(node, uglifyJsOptions);
        }

        return node;
    });

    tree.match({attrs: true}, node => {
        return processNodeWithOnAttrs(node, uglifyJsOptions);
    });

    return tree;
}


function processScriptNode(scriptNode, uglifyJsOptions) {
    const js = (scriptNode.content || []).join(' ').trim();
    if (! js) {
        return scriptNode;
    }

    const result = uglifyJs.minify(js, uglifyJsOptions);
    scriptNode.content = [result.code];

    return scriptNode;
}


function processNodeWithOnAttrs(node, uglifyJsOptions) {
    const jsWrapperStart = 'function _(){';
    const jsWrapperEnd = '}';

    for (let attrName of Object.keys(node.attrs || {})) {
        if (attrName.search('on') !== 0) {
            continue;
        }

        // For example onclick="return false" is valid,
        // but "return false;" is invalid (error: 'return' outside of function)
        // Therefore the attribute's code should be wrapped inside function:
        // "function _(){return false;}"
        let wrappedJs = jsWrapperStart + node.attrs[attrName] + jsWrapperEnd;
        let wrappedMinifiedJs = uglifyJs.minify(wrappedJs, uglifyJsOptions).code;
        let minifiedJs = wrappedMinifiedJs.substring(
            jsWrapperStart.length,
            wrappedMinifiedJs.length - jsWrapperEnd.length
        );
        node.attrs[attrName] = minifiedJs;
    }

    return node;
}
