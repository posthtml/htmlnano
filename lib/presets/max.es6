import safePreset from './safe';

/**
 * Maximal minification (might break some pages)
 */
export default Object.assign({}, safePreset, {
    collapseWhitespace: 'all',
    removeComments: 'all',
    removeRedundantAttributes: true,
    removeUnusedCss: {},
    minifyCss: {
        preset: 'default',
    },
    minifySvg: {},
});
