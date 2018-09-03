const ampBoilerplateAttributes = [
    'amp-boilerplate',
    'amp4ads-boilerplate',
    'amp4email-boilerplate'
];

export function isAmpBoilerplate(node) {
    if (!node.attrs) {
        return false;
    }
    for (let attr of ampBoilerplateAttributes) {
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
