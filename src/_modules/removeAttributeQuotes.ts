// Specification: https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
// See also: https://github.com/posthtml/posthtml-render/pull/30
// See also: https://github.com/posthtml/htmlnano/issues/6#issuecomment-707105334

import type { HtmlnanoModule } from '../types';

/** Disable quoteAllAttributes while not overriding the configuration */
const mod: HtmlnanoModule = {
    default: function removeAttributeQuotes(tree) {
        if (tree.options) tree.options.quoteAllAttributes ??= false;

        return tree;
    }
};

export default mod;
