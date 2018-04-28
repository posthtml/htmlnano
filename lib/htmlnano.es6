import objectAssign from 'object-assign';
import posthtml from 'posthtml';

// Array of all enabled modules
const defaultOptions = {
    removeComments: 'safe',
    removeEmptyAttributes: true,
    removeRedundantAttributes: false,
    collapseWhitespace: 'conservative',
    collapseBooleanAttributes: true,
    mergeStyles: true,
    mergeScripts: true,
    minifyCss: {
        safe: true
    },
    minifyJs: {},
    minifyJson: {},
    minifySvg: {},
    custom: []
};

function htmlnano(options = {}) {
    return function minifier(tree) {
        options = objectAssign({}, defaultOptions, options);
        let promise = Promise.resolve(tree);
        for (let moduleName of Object.keys(options)) {
            if (! options[moduleName]) {
                // The module is disabled
                continue;
            }

            if (defaultOptions[moduleName] === undefined) {
                throw new Error('Module "' + moduleName + '" is not defined');
            }

            let module = require('./modules/' + moduleName);
            promise = promise.then(tree => module.default(tree, options, options[moduleName]));
        }

        return promise;
    };
}


htmlnano.process = function (html, options) {
    return posthtml([htmlnano(options)]).process(html);
};

htmlnano.defaultOptions = defaultOptions;

export default htmlnano;
