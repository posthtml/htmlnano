import SVGO from 'svgo';
import posthtmlRender from 'posthtml-render';

/** Minify SVG with SVGO */
export default function minifySvg(tree, options, svgoOptions = {}) {
    let promises = [];
    let svgo = new SVGO(svgoOptions);

    tree.match({tag: 'svg'}, node => {
        let svgStr = posthtmlRender(node);
        let promise = new Promise((resolve, reject) => {
            svgo.optimize(svgStr, result => {
                result ? resolve(result.data) : reject();
            });
        }).then(minifiedSvg => {
            node.tag = false;
            node.attrs = {};
            node.content = minifiedSvg;
        });
        promises.push(promise);

        return node;
    });

    return Promise.all(promises).then(() => tree);
}