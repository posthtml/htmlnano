import cssnano from 'cssnano';

/** Minify CSS with cssnano */
export default function minifyCss(tree, options, cssnanoOptions) {
    let promises = [];
    tree.walk(node => {
        if (node.tag === 'style' && node.content && node.content.length) {
            promises.push(processStyleNode(node, cssnanoOptions));
        } else if (node.attrs && node.attrs.style) {
            promises.push(processStyleAttr(node, cssnanoOptions));
        }

        return node;
    });

    return Promise.all(promises).then(() => tree);
}


function processStyleNode(styleNode, cssnanoOptions) {
    return cssnano
        .process(styleNode.content.join(' '), cssnanoOptions)
        .then(result => styleNode.content = [result.css]);
}


function processStyleAttr(node, cssnanoOptions) {
    // CSS "color: red;" is invalid. Therefore it should be wrapped inside some selector:
    // a{color: red;}
    const wrapperStart = 'a{';
    const wrapperEnd = '}';
    const wrappedStyle = wrapperStart + (node.attrs.style || '') + wrapperEnd;

    return cssnano
        .process(wrappedStyle, cssnanoOptions)
        .then(result => {
            const minifiedCss = result.css;
            // Remove wrapperStart at the start and wrapperEnd at the end of minifiedCss
            node.attrs.style = minifiedCss.substring(
                wrapperStart.length,
                minifiedCss.length - wrapperEnd.length
            );
        });
}
