/**
 * Minify HTML in a safe way without breaking anything.
 */
export default {
    sortAttributes: false,
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
    minifySvg: {
        plugins: [
            { collapseGroups: false },
            { convertShapeToPath: false },
        ],
    },
    minifyConditionalComments: false,
    removeEmptyAttributes: true,
    removeRedundantAttributes: false,
    removeComments: 'safe',
    removeAttributeQuotes: false,
    sortAttributesWithLists: 'alphabetical',
    minifyUrls: false,
    removeOptionalTags: false,
};
