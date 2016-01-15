/** Custom minifier modules */
export default function custom(tree, options, customModules) {
    if (! Array.isArray(customModules)) {
        customModules = [customModules];
    }

    customModules.forEach(customModule => {
        tree = customModule(tree, options);
    });

    return tree;
}
