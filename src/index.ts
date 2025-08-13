import posthtml from 'posthtml';
import { cosmiconfigSync } from 'cosmiconfig';
import safePreset from './presets/safe.js';
import ampSafePreset from './presets/ampSafe.js';
import maxPreset from './presets/max.js';
import type { HtmlnanoModule, HtmlnanoModuleAttrsHandler, HtmlnanoModuleContentHandler, HtmlnanoModuleNodeHandler, HtmlnanoOptions, HtmlnanoOptionsConfigFile, HtmlnanoPredefinedPresets, HtmlnanoPreset, PostHTMLTreeLike } from './types';
import type PostHTML from 'posthtml';

export type * from './types';

const presets: HtmlnanoPredefinedPresets = {
    safe: safePreset,
    ampSafe: ampSafePreset,
    max: maxPreset
};

export function loadConfig(
    options?: HtmlnanoOptions,
    preset?: HtmlnanoPreset,
    configPath?: string
): [Partial<HtmlnanoOptions>, HtmlnanoPreset] {
    const { skipConfigLoading = false, ...rest } = options || {};
    let restConfig: Partial<HtmlnanoOptions> = rest;

    if (!skipConfigLoading) {
        const explorer = cosmiconfigSync('htmlnano');
        const rc = configPath ? explorer.load(configPath) : explorer.search();
        if (rc) {
            const { preset: presetName } = rc.config as HtmlnanoOptionsConfigFile;
            if (presetName) {
                if (!preset && presetName in presets) {
                    preset = presets[presetName];
                }

                delete (rc.config as HtmlnanoOptionsConfigFile).preset;
            }

            if (!options) {
                restConfig = rc.config as Partial<HtmlnanoOptions>;
            }
        }
    }

    return [
        restConfig || {},
        preset || safePreset
    ];
}

const optionalDependencies = {
    minifyCss: ['cssnano', 'postcss'],
    minifyJs: ['terser'],
    minifyUrls: ['relateurl', 'srcset', 'terser'],
    minifySvg: ['svgo']
} satisfies Partial<Record<keyof HtmlnanoOptions, string[]>>;

const interop = <T>(imported: Promise<{ default: T }>): Promise<T> => imported.then(mod => mod.default);

const modules = {
    collapseAttributeWhitespace: () => interop(import('./_modules/collapseAttributeWhitespace')),
    collapseBooleanAttributes: () => interop(import('./_modules/collapseBooleanAttributes')),
    collapseWhitespace: () => interop(import('./_modules/collapseWhitespace')),
    custom: () => interop(import('./_modules/custom')),
    deduplicateAttributeValues: () => interop(import('./_modules/deduplicateAttributeValues')),
    // example: () => import('./_modules/example.mjs'),
    mergeScripts: () => interop(import('./_modules/mergeScripts.js')),
    mergeStyles: () => interop(import('./_modules/mergeStyles.js')),
    minifyConditionalComments: () => interop(import('./_modules/minifyConditionalComments.js')),
    minifyCss: () => interop(import('./_modules/minifyCss.js')),
    minifyJs: () => interop(import('./_modules/minifyJs.js')),
    minifyJson: () => interop(import('./_modules/minifyJson.js')),
    minifySvg: () => interop(import('./_modules/minifySvg.js')),
    minifyUrls: () => interop(import('./_modules/minifyUrls.js')),
    normalizeAttributeValues: () => interop(import('./_modules/normalizeAttributeValues')),
    removeAttributeQuotes: () => interop(import('./_modules/removeAttributeQuotes.js')),
    removeComments: () => interop(import('./_modules/removeComments.js')),
    removeEmptyAttributes: () => interop(import('./_modules/removeEmptyAttributes.js')),
    removeOptionalTags: () => interop(import('./_modules/removeOptionalTags.js')),
    removeRedundantAttributes: () => interop(import('./_modules/removeRedundantAttributes.js')),
    removeUnusedCss: () => interop(import('./_modules/removeUnusedCss.js')),
    sortAttributes: () => interop(import('./_modules/sortAttributes.js')),
    sortAttributesWithLists: () => interop(import('./_modules/sortAttributesWithLists.js'))
} satisfies Record<string, () => Promise<HtmlnanoModule<any>>>;

export function htmlnano(optionsRun: HtmlnanoOptions = {}, presetRun?: HtmlnanoPreset) {
    // eslint-disable-next-line prefer-const -- re-assign options
    let [options, preset] = loadConfig(optionsRun, presetRun);

    const minifier: PostHTML.Plugin<never> = async (_tree) => {
        const tree = (_tree as unknown) as PostHTMLTreeLike;

        const nodeHandlers: HtmlnanoModuleNodeHandler[] = [];
        const attrsHandlers: HtmlnanoModuleAttrsHandler[] = [];
        const contentsHandlers: HtmlnanoModuleContentHandler[] = [];

        options = { ...preset, ...options };
        let promise = Promise.resolve(tree);

        for (const [moduleName, moduleOptions] of Object.entries(options)) {
            if (!moduleOptions) {
                // The module is disabled
                continue;
            }

            if (!(moduleName in safePreset)) {
                throw new Error('Module "' + moduleName + '" is not defined');
            }

            if (moduleName in optionalDependencies) {
                const modules = optionalDependencies[moduleName as keyof typeof optionalDependencies];
                await Promise.all(modules.map(async (dependency) => {
                    try {
                        await import(dependency);
                    } catch (e: unknown) {
                        if (typeof e === 'object' && e !== null && 'code' in e && typeof e.code === 'string') {
                            if (e.code === 'MODULE_NOT_FOUND' || e.code === 'ERR_MODULE_NOT_FOUND') {
                                if (!options.skipInternalWarnings) {
                                    console.warn(`You have to install "${dependency}" in order to use htmlnano's "${moduleName}" module`);
                                    return;
                                }
                            }

                            throw e;
                        }
                    }
                }));
            }

            const mod: HtmlnanoModule = moduleName in modules
                ? (await (modules[moduleName as keyof typeof modules]())) as HtmlnanoModule
                : (await import(`./_modules/${moduleName}.mjs`)) as HtmlnanoModule;

            if (typeof mod.onAttrs === 'function') {
                attrsHandlers.push(mod.onAttrs(options, moduleOptions as Partial<any>));
            }
            if (typeof mod.onContent === 'function') {
                contentsHandlers.push(mod.onContent(options, moduleOptions as Partial<any>));
            }
            if (typeof mod.onNode === 'function') {
                nodeHandlers.push(mod.onNode(options, moduleOptions as Partial<any>));
            }
            if (typeof mod.default === 'function') {
                promise = promise.then(async tree => await mod.default!(tree, options, moduleOptions as Partial<any>));
            }
        }

        if (attrsHandlers.length + contentsHandlers.length + nodeHandlers.length === 0) {
            return promise;
        }

        return promise.then((tree) => {
            tree.walk((node) => {
                if (node) {
                    if (node.attrs && typeof node.attrs === 'object') {
                        // Convert all attrs' key to lower case
                        let newAttrsObj: Record<string, string | boolean | void> = {};
                        Object.entries(node.attrs).forEach(([attrName, attrValue]) => {
                            newAttrsObj[attrName.toLowerCase()] = attrValue;
                        });

                        for (const handler of attrsHandlers) {
                            newAttrsObj = handler(newAttrsObj, node);
                        }

                        node.attrs = newAttrsObj as PostHTML.NodeAttributes;
                    }

                    if (node.content) {
                        node.content = typeof node.content === 'string' ? [node.content] : node.content;

                        if (Array.isArray(node.content) && node.content.length > 0) {
                            for (const handler of contentsHandlers) {
                                const result = handler(node.content ?? [], node);
                                node.content = Array.isArray(result) ? result : [result];
                            }
                        }
                    }

                    for (const handler of nodeHandlers) {
                        if (handler) {
                            node = handler(node) as PostHTML.Node;
                        }
                    }
                }

                return node;
            });

            return tree;
        });
    };

    return minifier;
}

export function getRequiredOptionalDependencies(optionsRun: HtmlnanoOptions, presetRun: HtmlnanoPreset) {
    const [options] = loadConfig(optionsRun, presetRun);

    return Array.from(Object.keys(options).reduce<Set<string>>(
        (acc, moduleName) => {
            if (moduleName in optionalDependencies) {
                const dependencies = optionalDependencies[moduleName as keyof typeof optionalDependencies];
                // eslint-disable-next-line @typescript-eslint/unbound-method -- thisArg provided by forEach
                dependencies.forEach(acc.add, acc);
            }
            return acc;
        },
        new Set()
    ));
}

export function process(
    html: string,
    options?: HtmlnanoOptions,
    preset?: HtmlnanoPreset,
    postHtmlOptions?: PostHTML.Options
) {
    return posthtml([htmlnano(options, preset)])
        .process(html, postHtmlOptions);
}

// https://github.com/webpack-contrib/html-minimizer-webpack-plugin/blob/faca00f2219514bc671c5942685721f0b5dbaa70/src/utils.js#L74
export function htmlMinimizerWebpackPluginMinify(
    input: { [file: string]: string },
    minimizerOptions?: HtmlnanoOptions
) {
    const [[, code]] = Object.entries(input);
    return htmlnano.process(code, minimizerOptions, presets.safe)
        .then((result) => {
            return {
                code: result.html
            };
        });
}

htmlnano.presets = presets;
htmlnano.getRequiredOptionalDependencies = getRequiredOptionalDependencies;
htmlnano.process = process;
htmlnano.htmlMinimizerWebpackPluginMinify = htmlMinimizerWebpackPluginMinify;
htmlnano.loadConfig = loadConfig;

export default htmlnano;

if (typeof module !== 'undefined') {
    module.exports = htmlnano;
}
