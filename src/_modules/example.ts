/**
 * It is an example htmlnano module.
 */

import type { HtmlnanoModule } from '../types';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- example interface
export interface ModuleOptions {
    // Define module options here, if needed
}

const mod: HtmlnanoModule<ModuleOptions> = {
    /**
     * Modify attributes of node. Optional.
     *
     * @param {Partial<import('../types').HtmlnanoOptions>} options - Options that were passed to htmlnano
     * @param {ModuleOptions} moduleOptions — Module options. For most modules this is just "true" (indication that the module was enabled)
     * @return {Function} - Return a function that takes attribute object and the node (for the context), and returns the modified attribute object
     */
    onAttrs(options, moduleOptions) {
        // you can run some init operation here
        return (attrs, node) => {
            // You can modify "attrs" based on "node"
            const newAttrs = { ...attrs };

            return newAttrs; // ... then return the modified attrs
        };
    },

    /**
     * Modify content of node. Optional.
     *
     * @param {Partial<import('../types').HtmlnanoOptions>} options - Options that were passed to htmlnano
     * @param {ModuleOptions} moduleOptions — Module options. For most modules this is just "true" (indication that the module was enabled)
     * @return {Function} - Return a function that takes contents (an array of node and string) and the node (for the context), and returns the modified content array.
     */
    onContent(options, moduleOptions) {
        // you can run some init operation here
        return (content, node) => {
            // Same goes the "content"

            return content; // ... return modified content here
        };
    },

    /**
     * It is possible to modify entire node as well. Optional.
     * @param {Partial<import('../types').HtmlnanoOptions>} options - Options that were passed to htmlnano
     * @param {ModuleOptions} moduleOptions — Module options. For most modules this is just "true" (indication that the module was enabled)
     * @return {Function} - Return a function that takes the node, and returns the new, modified node.
     */
    onNode(options, moduleOptions) {
        // you can run some init operation here

        return (node) => {
            return node; // ... return new node here
        };
    },

    /**
     * If you need to access the entire tree (for context like previous and next nodes, parent nodes, etc.)
     * Modify the entire tree. Optional.
     *
     * @param {import('../types').PostHTMLTreeLike} tree - PostHTML tree (https://github.com/posthtml/posthtml/blob/master/README.md)
     * @param {Partial<import('../types').HtmlnanoOptions>} options - Options that were passed to htmlnano
     * @param {ModuleOptions} moduleOptions — Module options. For most modules this is just "true" (indication that the module was enabled)
     * @return {object | Promise} - Return the modified tree.
     */
    default(tree, moduleOptions) {
        // Module filename (example.es6), exported default function name (example),
        // and test filename (example.js) must be the same.

        // You can traverse the tree...
        tree.walk((node) => {
            // ...and make some minifications
            return node;
        });

        // At the end you must return the tree
        return tree;
    },
};

// Finally, export the module, you can use either default or named export, depends on how you will import your module later.
export default mod;
