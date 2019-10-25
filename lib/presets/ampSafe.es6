import safePreset from './safe';

/**
 * A safe preset for AMP pages (https://www.ampproject.org)
 */
export default Object.assign({}, safePreset, {
    collapseBooleanAttributes: {
        amphtml: true,
    },
    minifyJs: false,
});
