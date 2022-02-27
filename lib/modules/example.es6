/**
 * Modify attributes of node. Optional.
 *
 * @param {object} options - Options that were passed to htmlnano
 * @param moduleOptions — Module options. For most modules this is just "true" (indication that the module was enabled)
 */
export function onAttrs(options, moduleOptions) {
    return (attrs, node) => {
        // You can modify "attrs" based on "node"
        const newAttrs = { ...attrs };

        return newAttrs; // ... then return the modified attrs
    };
}

/**
 * Modify content of node. Optional.
 *
 * @param {object} options - Options that were passed to htmlnano
 * @param moduleOptions — Module options. For most modules this is just "true" (indication that the module was enabled)
 */
export function onContent(options, moduleOptions) {
    return (content, node) => {
        // Same goes the "content"

        return content; // ... return modified content here
    };
}

/**
 * It is possible to modify entire ndde as well. Optional.
 * @param {object} options - Options that were passed to htmlnano
 * @param moduleOptions — Module options. For most modules this is just "true" (indication that the module was enabled)
 */
export function onNode(options, moduleOptions) {
    return (node) => {
        return node; // ... return new node here
    };
}

/**
 * Modify the entire tree. Optional.
 *
 * @param {object} tree - PostHTML tree (https://github.com/posthtml/posthtml/blob/master/README.md)
 * @param {object} options - Options that were passed to htmlnano
 * @param moduleOptions — Module options. For most modules this is just "true" (indication that the module was enabled)
 */
export default function example(tree, options, moduleOptions) {
    // Module filename (example.es6), exported default function name (example),
    // and test filename (example.js) must be the same.

    // You can traverse the tree...
    tree.walk(node => {
        // ...and make some minification
    });

    // At the end you must return the tree
    return tree;

    // Or a promise with the tree
    return somePromise.then(() => tree);
}
