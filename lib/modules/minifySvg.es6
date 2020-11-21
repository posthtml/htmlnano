import SVGO from 'svgo';

/** Minify SVG with SVGO */
export default function minifySvg(tree, options, svgoOptions = {}) {
    let promises = [];

    const svgo = new SVGO(svgoOptions);

    tree.match({tag: 'svg'}, node => {
        let svgStr = tree.render(node);
        let promise = svgo.optimize(svgStr).then(result => {
            node.tag = false;
            node.attrs = {};
            node.content = result.data;
        });
        promises.push(promise);

        return node;
    });

    return Promise.all(promises).then(() => tree);
}
