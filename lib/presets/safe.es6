/**
 * Minify HTML in a safe way without breaking anything.
 */
export default {
    collapseAttributeWhitespace: true,
    collapseBooleanAttributes: {
        amphtml: false,
    },
    collapseWhitespace: 'conservative',
    custom: [],
    deduplicateAttributeValues: true,
    mergeScripts: true,
    mergeStyles: true,
    removeUnusedCss: false,
    minifyCss: {
        preset: 'default',
    },
    minifyJs: {},
    minifyJson: {},
    minifySvg: {},
    removeEmptyAttributes: true,
    removeRedundantAttributes: false,
    removeComments: 'safe',
};
