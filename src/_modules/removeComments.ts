import { isComment, isConditionalComment } from '../helpers';
import type { HtmlnanoModule, PostHTMLNodeLike } from '../types';

const MATCH_EXCERPT_REGEXP = /<!-- ?more ?-->/i;

export type RemoveCommentsOptions = boolean | 'safe' | 'all' | RegExp | ((comment: string) => boolean);

/** Removes HTML comments */
const mod: HtmlnanoModule<RemoveCommentsOptions> = {
    onNode(_, removeType) {
        if (removeType !== 'all' && removeType !== 'safe' && !isMatcher(removeType)) {
            removeType = 'safe';
        }
        return (node) => {
            if (isCommentToRemove(node, removeType)) {
                return '';
            }
            return node;
        };
    },
    onContent(_, removeType) {
        if (removeType !== 'all' && removeType !== 'safe' && !isMatcher(removeType)) {
            removeType = 'safe';
        }
        return (contents) => {
            return contents.filter(content => !isCommentToRemove(content, removeType));
        };
    }
};

export default mod;

function isCommentToRemove(text: PostHTMLNodeLike, removeType: Partial<RemoveCommentsOptions>): boolean {
    if (typeof text !== 'string') {
        return false;
    }

    if (!isComment(text)) {
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

    if (isMatcher(removeType)) {
        return isMatch(text, removeType);
    }

    return true;
}

function isMatch(input: string, matcher: Partial<RemoveCommentsOptions>): boolean {
    if (matcher instanceof RegExp) {
        return matcher.test(input);
    }

    if (typeof matcher === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call -- typescript incorrectly infers Partialled type
        return !!matcher(input);
    }

    return false;
}

function isMatcher(matcher: Partial<RemoveCommentsOptions>) {
    if (matcher instanceof RegExp || typeof matcher === 'function') {
        return true;
    }

    return false;
}
