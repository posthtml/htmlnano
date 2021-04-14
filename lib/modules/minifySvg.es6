import { optimize } from 'svgo';

/** Minify SVG with SVGO */
export default function minifySvg(tree, options, svgoOptions = {}) {
    tree.match({tag: 'svg'}, node => {
        let svgStr = tree.render(node, { closingSingleTag: 'slash', quoteAllAttributes: true });
        const result = optimize(svgStr, svgoOptions);
        node.tag = false;
        node.attrs = {};
        node.content = result.data;
        return node;
    });

    return tree;
}
