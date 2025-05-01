import type PostHTML from 'posthtml';

export interface HtmlnanoPreset extends Omit<HtmlnanoOptions, 'skipConfigLoading'> {}

export interface Presets {
    safe: HtmlnanoPreset;
    ampSafe: HtmlnanoPreset;
    max: HtmlnanoPreset;
}

type Preset = Presets[keyof Presets];

export function loadConfig(
    options?: HtmlnanoOptions,
    preset?: Preset,
    configPath?: string
): [Partial<HtmlnanoOptions>, Preset];

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
