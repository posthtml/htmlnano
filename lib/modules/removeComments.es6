import { isComment, isConditionalComment } from '../helpers';

const MATCH_EXCERPT_REGEXP = /<!-- ?more ?-->/i;

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

    if (removeType === 'safe') {
        const isNoindex = text === '<!--noindex-->' || text === '<!--/noindex-->';
        // Don't remove noindex comments.
        // See: https://yandex.com/support/webmaster/controlling-robot/html.xml
        if (isNoindex) {
            return false;
        }

        const isServerSideExclude = text === '<!--sse-->' || text === '<!--/sse-->';
        // Don't remove sse comments.
        // See: https://support.cloudflare.com/hc/en-us/articles/200170036-What-does-Server-Side-Excludes-SSE-do-
        if (isServerSideExclude) {
            return false;
        }

        // https://en.wikipedia.org/wiki/Conditional_comment
        if (isConditionalComment(text)) {
            return false;
        }

        // Hexo: https://hexo.io/docs/tag-plugins#Post-Excerpt
        // Hugo: https://gohugo.io/content-management/summaries/#manual-summary-splitting
        // WordPress: https://wordpress.com/support/wordpress-editor/blocks/more-block/2/
        // Jekyll: https://jekyllrb.com/docs/posts/#post-excerpts
        const isCMSExcerptComment = MATCH_EXCERPT_REGEXP.test(text);
        if (isCMSExcerptComment) {
            return false;
        }
    }

    return true;
}
