import type { HtmlnanoModule, HtmlnanoOptions, PostHTMLTreeLike } from '../types';

type CustomModule = (tree: PostHTMLTreeLike, options: Partial<HtmlnanoOptions>) => PostHTMLTreeLike;

/** Meta-module that runs custom modules */
const mod: HtmlnanoModule<CustomModule[]> = {
    default: function custom(tree, options, customModules) {
        if (!customModules) {
            return tree;
        }

        if (!Array.isArray(customModules)) {
            customModules = [customModules];
        }

        customModules.forEach((customModule) => {
            if (customModule) {
                tree = customModule(tree, options);
            }
        });

        return tree;
    }
};
export default mod;
