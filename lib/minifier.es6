import fs from 'fs';
import path from 'path';
import objectAssign from 'object-assign';

const modulesDir = path.join(__dirname, 'modules');
export const modules = fs.readdirSync(modulesDir)
    .filter(filename => filename.search('.es6') > 0)
    .map(filename => path.basename(filename, '.es6'));


export default (options = {}) => {
    return function minifier(tree) {
        let defaultOptions = {};
        modules.forEach(moduleName => {
            // Enable all modules by default
            defaultOptions[moduleName] = true;
        });

        options = objectAssign({}, defaultOptions, options);
        for (let moduleName of Object.keys(options)) {
            if (! options[moduleName]) {
                // The module is disabled
                continue;
            }

            if (modules.indexOf(moduleName) === -1) {
                throw new Error('Module "' + moduleName + '" is not defined');
            }

            tree = require(path.join(modulesDir, moduleName)).default(tree);
        }

        return tree;
    };
};
