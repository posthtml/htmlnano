import { optionalImport } from '../helpers';
import type { HtmlnanoModule } from '../types';

/** Minify SVG with SVGO */
const mod: HtmlnanoModule = {
    async default(tree, options, svgoOptions) {
        const svgo = await optionalImport<typeof import('svgo')>('svgo');

        if (!svgo) return tree;

        tree.match({ tag: 'svg' }, (node) => {
            const svgStr = tree.render(node, { closingSingleTag: 'slash', quoteAllAttributes: true });

            try {
                const result = svgo.optimize(svgStr, svgoOptions);
                // @ts-expect-error -- remove this node
                node.tag = false;
                node.attrs = {};
                // result.data is a string, we need to cast it to an array
                node.content = [result.data];
                return node;
            } catch (error) {
                console.error('htmlnano fails to minify the svg:');
                console.error(error);
                if (
                    error
                    && typeof error === 'object'
                    && 'name' in error
                    && error.name === 'SvgoParserError'
                ) {
                    console.error(error);
                }
                // We return the node as-is
                return node;
            }
        });

        return tree;
    }
};

export default mod;
