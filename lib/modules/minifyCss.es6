import cssnano from 'cssnano';

/** Minify CSS with cssnano */
export default function minifyCss(tree, options, moduleOptions) {
    let promises = [];
    tree.match({tag: 'style'}, styleNode => {
        if (! styleNode.content || ! styleNode.content.length) {
            return styleNode;
        }

        let promise = cssnano
            .process(styleNode.content.join(' '), moduleOptions)
            .then(result => styleNode.content = [result.css]);

        promises.push(promise);
        return styleNode;
    });

    return Promise.all(promises).then(() => tree);
}
