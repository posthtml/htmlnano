/** Removes HTML comments */
export default function removeComments(tree) {
    tree.walk(node => {
        if (node.contents && node.contents.length) {
            node.contents = node.contents.filter(content => ! isCommentToRemove(content));
        } else if (isCommentToRemove(node)) {
            node = '';
        }

        return node;
    });

    return tree;
}


function isCommentToRemove(text) {
    if (typeof text !== 'string') {
        return false;
    }

    if (text.search('<!--') !== 0) {
        // Not HTML comment
        return false;
    }

    if (text === '<!--noindex-->' || text === '<!--/noindex-->') {
        // Don't remove noindex comments.
        // See: https://yandex.com/support/webmaster/controlling-robot/html.xml
        return false;
    }

    return true;
}
