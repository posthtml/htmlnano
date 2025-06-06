import type { HtmlnanoPreset } from '../types.js';
import safePreset from './safe';

/**
 * Maximal minification (might break some pages)
 */
export default { ...safePreset,
    collapseWhitespace: 'all',
    removeComments: 'all',
    removeAttributeQuotes: true,
    removeRedundantAttributes: true,
    mergeScripts: true,
    mergeStyles: true,
    removeUnusedCss: {},
    minifyCss: {
        preset: 'default'
    },
    minifySvg: {},
    minifyConditionalComments: true,
    removeOptionalTags: true
} as HtmlnanoPreset;
