import type PostHTML from 'posthtml';

const ampBoilerplateAttributes = [
    'amp-boilerplate',
    'amp4ads-boilerplate',
    'amp4email-boilerplate'
];

export function isAmpBoilerplate(node: PostHTML.Node) {
    if (!node.attrs) {
        return false;
    }
    for (const attr of ampBoilerplateAttributes) {
        if (attr in node.attrs) {
            return true;
        }
    }
    return false;
}

export function isComment(content: string) {
    if (typeof content === 'string') {
        return content.trim().startsWith('<!--');
    }
    return false;
}

export function isConditionalComment(content: string) {
    const clean = (content || '').trim();
    return clean.startsWith('<!--[if') || clean === '<!--<![endif]-->';
}

export function isStyleNode(node: PostHTML.Node) {
    return node.tag === 'style' && !isAmpBoilerplate(node) && 'content' in node && node.content && node.content.length > 0;
}

export function extractCssFromStyleNode(node: PostHTML.Node) {
    return Array.isArray(node.content) ? (node.content as string[]).join(' ') : node.content;
}

export function isEventHandler(attributeName: string) {
    return attributeName && attributeName.slice(0, 2).toLowerCase() === 'on' && attributeName.length >= 5;
}

export async function optionalImport<Module = unknown, Default = Module>(moduleName: string) {
    try {
        const module = (await import(moduleName)) as Module & { default?: Default };
        return module.default || module;
    } catch (e) {
        if (typeof e === 'object' && e && 'code' in e && (e.code === 'MODULE_NOT_FOUND' || e.code === 'ERR_MODULE_NOT_FOUND')) {
            return null;
        }
        throw e;
    }
}
