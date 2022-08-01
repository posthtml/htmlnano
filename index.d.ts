import type PostHTML from "posthtml";
import type terser from "terser";

interface HtmlnanoOptions {
  skipConfigLoading?: boolean;
  collapseAttributeWhitespace?: boolean;
  collapseBooleanAttributes?: {
    amphtml?: boolean;
  };
  collapseWhitespace?: "conservative" | "all" | "aggressive";
  custom?: (tree: PostHTML.Node, options?: any) => PostHTML.Node;
  deduplicateAttributeValues?: boolean;
  minifyUrls?: boolean;
  mergeStyles?: boolean;
  mergeScripts?: boolean;
  minifyCss?: {
    preset?: any;
  };
  minifyConditionalComments?: boolean;
  minifyJs?: terser.FormatOptions;
  minifyJson?: any;
  minifySvg?: any;
  normalizeAttributeValues?: boolean;
  removeAttributeQuotes?: boolean;
  removeComments?: boolean | "safe" | "all" | RegExp | (() => void);
  removeEmptyAttributes?: boolean;
  removeRedundantAttributes?: boolean;
  removeOptionalTags?: boolean;
  removeUnusedCss?: boolean;
  sortAttributes?: boolean;
  sortAttributesWithLists?: "alphabetical" | "frequency";
}

interface HtmlnanoPreset extends Omit<HtmlnanoOptions, "skipConfigLoading"> {}

interface Presets {
  safe: HtmlnanoPreset;
  ampSafe: HtmlnanoPreset;
  max: HtmlnanoPreset;
}

type Preset = Presets[keyof Presets];

export function loadConfig(
  options?: HtmlnanoOptions,
  preset?: Preset,
  configPath?: string
): [HtmlnanoOptions | {}, Preset];

declare function htmlnano<TMessage>(
  options?: HtmlnanoOptions,
  preset?: Preset
): (tree: PostHTML.Node) => Promise<PostHTML.Result<TMessage>>;

interface PostHtmlOptions {
  directives?: Array<{
    name: string | RegExp;
    start: string;
    end: string;
  }>;
  sourceLocations?: boolean;
  recognizeNoValueAttribute?: boolean;
  xmlMode?: boolean;
  decodeEntities?: boolean;
  lowerCaseTags?: boolean;
  lowerCaseAttributeNames?: boolean;
  recognizeCDATA?: boolean;
  recognizeSelfClosing?: boolean;
  Tokenizer?: any;
}

declare namespace htmlnano {
  export function process<TMessage>(
    html: string,
    options?: HtmlnanoOptions,
    preset?: Preset,
    postHtmlOptions?: PostHtmlOptions
  ): Promise<PostHTML.Result<TMessage>>;

  export function getRequiredOptionalDependencies(
    optionsRun?: HtmlnanoOptions,
    presetRun?: Preset
  ): string[];

  export function htmlMinimizerWebpackPluginMinify(
    input: { [file: string]: string },
    minimizerOptions?: HtmlnanoOptions
  ): any;

  export const presets: Presets;
}

export default htmlnano;
