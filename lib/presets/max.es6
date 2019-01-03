import objectAssign from 'object-assign';
import safePreset from './safe';

/**
 * Maximal minification (might break some pages)
 */
export default objectAssign({}, safePreset, {
    collapseWhitespace: 'all',
    removeComments: 'all',
    removeRedundantAttributes: true,
    removeUnusedCss: {},
    minifyCss: {
        preset: 'default',
    }
});
