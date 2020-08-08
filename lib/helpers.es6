const ampBoilerplateAttributes = [
    'amp-boilerplate',
    'amp4ads-boilerplate',
    'amp4email-boilerplate'
];

export function isAmpBoilerplate(node) {
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

export function isComment(content) {
    return (content || '').trim().search('<!--') === 0;
}

export function isConditionalComment(content) {
    return (content || '').trim().search(/<!--\[if/) === 0;
}

export function isStyleNode(node) {
    return node.tag === 'style' && !isAmpBoilerplate(node) && 'content' in node && node.content.length > 0;
}

export function extractCssFromStyleNode(node) {
    return Array.isArray(node.content) ? node.content.join(' ') : node.content;
}
