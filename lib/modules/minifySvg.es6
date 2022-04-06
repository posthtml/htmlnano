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
        // result.data is a string, we need to cast it to an array
        node.content = [result.data];
        return node;
    });

    return tree;
}
