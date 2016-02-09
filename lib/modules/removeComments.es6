import { isComment, isConditionalComment } from '../helpers';


/** Removes HTML comments */
export default function removeComments(tree, options, removeType) {
    if (removeType !== 'all' && removeType !== 'safe') {
        removeType = 'safe';
    }

    tree.walk(node => {
        if (node.contents && node.contents.length) {
            node.contents = node.contents.filter(content => ! isCommentToRemove(content, removeType));
        } else if (isCommentToRemove(node, removeType)) {
            node = '';
        }

        return node;
    });

    return tree;
}


function isCommentToRemove(text, removeType) {
    if (typeof text !== 'string') {
        return false;
    }

    if (! isComment(text)) {
        // Not HTML comment
        return false;
    }

    const isNoindex = text === '<!--noindex-->' || text === '<!--/noindex-->';
    if (removeType === 'safe' && isNoindex) {
        // Don't remove noindex comments.
        // See: https://yandex.com/support/webmaster/controlling-robot/html.xml
        return false;
    }

    // https://en.wikipedia.org/wiki/Conditional_comment
    if (removeType === 'safe' && isConditionalComment(text)) {
        return false;
    }

    return true;
}
