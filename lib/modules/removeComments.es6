/** Removes HTML comments */
export default function removeComments(tree) {
    tree.walk(node => {
        if (node.contents && node.contents.length) {
            node.contents = node.contents.filter(content => ! isComment(content));
        } else if (isComment(node)) {
            node = '';
        }

        return node;
    });

    return tree;
}


function isComment(text) {
    return typeof text === 'string' && text.search('<!--') === 0
}
