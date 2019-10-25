import objectAssign from 'object-assign';
import safePreset from './safe';

/**
 * A safe preset for AMP pages (https://www.ampproject.org)
 */
export default objectAssign({}, safePreset, {
    collapseBooleanAttributes: {
        amphtml: true,
    },
    minifyJs: false,
});
