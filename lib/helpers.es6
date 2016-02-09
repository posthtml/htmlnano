export function isComment(content) {
    return (content || '').trim().search('<!--') === 0;
}

export function isConditionalComment(content) {
    return (content || '').trim().search(/<!--\[if/) === 0;
}
