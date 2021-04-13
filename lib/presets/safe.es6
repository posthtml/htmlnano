import { extendDefaultPlugins } from 'svgo';

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
        plugins: extendDefaultPlugins([
            { name: 'collapseGroups', active: false },
            { name: 'convertShapeToPath', convertShapeToPath: false },
        ]),
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
