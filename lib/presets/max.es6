import safePreset from './safe';

/**
 * Maximal minification (might break some pages)
 */
export default { ...safePreset,
    collapseWhitespace: 'all',
    removeComments: 'all',
    removeAttributeQuotes: true,
    removeRedundantAttributes: true,
    removeUnusedCss: {},
    minifyCss: {
        preset: 'default',
    },
    minifySvg: {},
};
