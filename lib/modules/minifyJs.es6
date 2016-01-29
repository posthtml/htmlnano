import uglifyJs from 'uglify-js';

/** Minify JS with UglifyJS */
export default function minifyJs(tree, options, uglifyJsOptions) {
    uglifyJsOptions.fromString = true;

    tree.match({tag: 'script'}, scriptNode => {
        const js = (scriptNode.content || []).join(' ').trim();
        if (! js) {
            return scriptNode;
        }

        const result = uglifyJs.minify(js, uglifyJsOptions);
        scriptNode.content = [result.code];
        return scriptNode;
    });

    return tree;
}
