import type PostHTML from 'posthtml';
import type { MinifyOptions } from 'terser';
import type { Options as CssNanoOptions } from 'cssnano';
import type { Config as SvgoOptimizeOptions } from 'svgo';

export type PostHTMLTreeLike = [PostHTML.Node] & PostHTML.NodeAPI & {
    options?: {
        quoteAllAttributes?: boolean | undefined;
    } | undefined;
    render(tree?: PostHTMLTreeLike): string;
};

type MaybeArray<T> = T | Array<T>;

export type PostHTMLNodeLike = PostHTML.Node | string;

export interface HtmlnanoOptions {
    skipConfigLoading?: boolean;
    skipInternalWarnings?: boolean;
    collapseAttributeWhitespace?: boolean;
    collapseBooleanAttributes?: {
        amphtml?: boolean;
    };
    collapseWhitespace?: 'conservative' | 'all' | 'aggressive';
    custom?: MaybeArray<(tree: PostHTMLTreeLike, options?: any) => (PostHTML.Node | PostHTMLTreeLike)>;
    deduplicateAttributeValues?: boolean;
    minifyUrls?: URL | string | false;
    mergeStyles?: boolean;
    mergeScripts?: boolean;
    minifyCss?: CssNanoOptions | boolean;
    minifyConditionalComments?: boolean;
    minifyJs?: MinifyOptions | boolean;
    minifyJson?: boolean;
    minifySvg?: SvgoOptimizeOptions | boolean;
    normalizeAttributeValues?: boolean;
    removeAttributeQuotes?: boolean;
    removeComments?: boolean | 'safe' | 'all' | RegExp | ((comment: string) => boolean);
    removeEmptyAttributes?: boolean;
    removeRedundantAttributes?: boolean;
    removeOptionalTags?: boolean;
    removeUnusedCss?: boolean;
    sortAttributes?: boolean | 'alphabetical' | 'frequency';
    sortAttributesWithLists?: boolean | 'alphabetical' | 'frequency';
}

export interface HtmlnanoPreset extends Omit<HtmlnanoOptions, 'skipConfigLoading'> {}

export type HtmlnanoPredefinedPreset = 'safe' | 'ampSafe' | 'max';
export type HtmlnanoPredefinedPresets = Record<HtmlnanoPredefinedPreset, HtmlnanoPreset>;

export type HtmlnanoOptionsConfigFile = Omit<HtmlnanoOptions, 'skipConfigLoading'> & {
    preset?: HtmlnanoPredefinedPreset;
};

export type HtmlnanoModuleAttrsHandler = (attrs: Record<string, string | boolean | void>, node: PostHTML.Node) => Record<string, string | boolean | void>;
export type HtmlnanoModuleContentHandler = (content: Array<PostHTMLNodeLike>, node: PostHTML.Node) => MaybeArray<PostHTMLNodeLike>;
export type HtmlnanoModuleNodeHandler = (node: PostHTMLNodeLike) => PostHTML.Node | string;

export type HtmlnanoModule<Options = any> = {
    onAttrs?: (options: Partial<HtmlnanoOptions>, moduleOptions: Partial<Options>) => HtmlnanoModuleAttrsHandler;
    onContent?: (options: Partial<HtmlnanoOptions>, moduleOptions: Partial<Options>) => HtmlnanoModuleContentHandler;
    onNode?: (options: Partial<HtmlnanoOptions>, moduleOptions: Partial<Options>) => HtmlnanoModuleNodeHandler;
    default?: (
        tree: PostHTMLTreeLike,
        options: Partial<HtmlnanoOptions>,
        moduleOptions: Partial<Options>,
    ) => PostHTMLTreeLike | Promise<PostHTMLTreeLike>;
};
