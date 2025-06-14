import type PostHTML from 'posthtml';
import { extractTextContentFromNode, isAmpBoilerplate } from '../helpers';
import type { HtmlnanoModule } from '../types';

/* Merge multiple <style> into one */
const mod: HtmlnanoModule = {
    default(tree) {
        const styleNodes: Record<string, PostHTML.Node> = {};

        tree.match({ tag: 'style' }, (node) => {
            if (typeof node !== 'object' || !node.tag || !node.content) return node;

            const nodeAttrs = node.attrs || {};
            // Skip <style scoped></style>
            // https://developer.mozilla.org/en/docs/Web/HTML/Element/style
            //
            // Also skip SRI, reasons are documented in "minifyJs" module
            if ('scoped' in nodeAttrs || 'integrity' in nodeAttrs) {
                return node;
            }

            if (isAmpBoilerplate(node)) {
                return node;
            }

            const styleType = nodeAttrs.type || 'text/css';
            const styleMedia = nodeAttrs.media || 'all';
            const styleKey = styleType + '_' + styleMedia;
            if (styleKey in styleNodes) {
                const styleContent = extractTextContentFromNode(node);

                styleNodes[styleKey].content ??= [];
                styleNodes[styleKey].content.push(' ' + styleContent);
                return '' as unknown as PostHTML.Node; // Remove node
            }

            node.content = node.content || [];
            styleNodes[styleKey] = node;
            return node;
        });

        return tree;
    }
};

export default mod;
