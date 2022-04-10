/**
 * Minify HTML in a safe way without breaking anything.
 */
export default {
    sortAttributes: false,
    collapseAttributeWhitespace: true,
    // normalizeAttributeValues will also normalize property value with invalid value default
    // See https://html.spec.whatwg.org/#invalid-value-default
    normalizeAttributeValues: true,
    // collapseBooleanAttributes will also collapse those default state can be omitted
    collapseBooleanAttributes: {
        amphtml: false,
    },
    collapseWhitespace: 'conservative',
    deduplicateAttributeValues: true,
    mergeScripts: false,
    mergeStyles: false,
    removeUnusedCss: false,
    minifyCss: {
        preset: 'default',
    },
    minifyJs: {},
    minifyJson: {},
    minifySvg: {
        plugins: [
            {
                name: 'preset-default',
                params: {
                    overrides: {
                        collapseGroups: false,
                        convertShapeToPath: false,
                    },
                },
            },
        ]
    },
    minifyConditionalComments: false,
    // collapseBooleanAttributes will remove attributes when missing value default matches the attribute's value
    // See https://html.spec.whatwg.org/#missing-value-default
    removeRedundantAttributes: false,
    removeEmptyAttributes: true,
    removeComments: 'safe',
    removeAttributeQuotes: false,
    sortAttributesWithLists: 'alphabetical',
    minifyUrls: false,
    removeOptionalTags: false,
    custom: []
};
