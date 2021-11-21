import { optionalRequire } from '../helpers';

const svgo = optionalRequire('svgo');

/** Minify SVG with SVGO */
export default function minifySvg(tree, options, svgoOptions = {}) {
    if (!svgo) return tree;

    tree.match({tag: 'svg'}, node => {
        let svgStr = tree.render(node, { closingSingleTag: 'slash', quoteAllAttributes: true });
        const result = svgo.optimize(svgStr, svgoOptions);
        node.tag = false;
        node.attrs = {};
        node.content = result.data;
        return node;
    });

    return tree;
}
