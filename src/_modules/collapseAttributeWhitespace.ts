import { isEventHandler } from '../helpers';
import type { HtmlnanoModule } from '../types';

export const attributesWithLists = new Set([
    'class',
    'dropzone',
    'rel', // a, area, link
    'ping', // a, area
    'sandbox', // iframe
    /**
     * https://github.com/posthtml/htmlnano/issues/180
     * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#attr-sizes
     *
     * "sizes" of <img> should not be modified, while "sizes" of <link> will only have one entry in most cases.
     */
    // 'sizes', // link
    'headers' // td, th
]);

/** empty set means the attribute is alwasy trimmable */
const attributesWithSingleValue = new Map<string, Set<string>>([
    ['accept', new Set(['input'])],
    ['action', new Set(['form'])],
    ['accesskey', new Set()],
    ['accept-charset', new Set(['form'])],
    ['cite', new Set(['blockquote', 'del', 'ins', 'q'])],
    ['cols', new Set(['textarea'])],
    ['colspan', new Set(['td', 'th'])],
    ['data', new Set(['object'])],
    ['dropzone', new Set()],
    ['formaction', new Set(['button', 'input'])],
    ['height', new Set(['canvas', 'embed', 'iframe', 'img', 'input', 'object', 'video'])],
    ['high', new Set(['meter'])],
    ['href', new Set(['a', 'area', 'base', 'link'])],
    ['itemid', new Set()],
    ['low', new Set(['meter'])],
    ['manifest', new Set(['html'])],
    ['max', new Set(['meter', 'progress'])],
    ['maxlength', new Set(['input', 'textarea'])],
    ['media', new Set(['source'])],
    ['min', new Set(['meter'])],
    ['minlength', new Set(['input', 'textarea'])],
    ['optimum', new Set(['meter'])],
    ['ping', new Set(['a', 'area'])],
    ['poster', new Set(['video'])],
    ['profile', new Set(['head'])],
    ['rows', new Set(['textarea'])],
    ['rowspan', new Set(['td', 'th'])],
    ['size', new Set(['input', 'select'])],
    ['span', new Set(['col', 'colgroup'])],
    ['src', new Set([
        'audio',
        'embed',
        'iframe',
        'img',
        'input',
        'script',
        'source',
        'track',
        'video'
    ])],
    ['start', new Set(['ol'])],
    ['step', new Set(['input'])],
    ['style', new Set()],
    ['tabindex', new Set()],
    ['usemap', new Set(['img', 'object'])],
    ['value', new Set(['li', 'meter', 'progress'])],
    ['width', new Set(['canvas', 'embed', 'iframe', 'img', 'input', 'object', 'video'])]
]);

/** Collapse whitespaces inside list-like attributes (e.g. class, rel) */
const mod: HtmlnanoModule = {
    onAttrs() {
        return (attrs, node) => {
            const newAttrs = attrs;

            Object.entries(attrs).forEach(([attrName, attrValue]) => {
                if (typeof attrValue !== 'string') return;

                if (attributesWithLists.has(attrName)) {
                    newAttrs[attrName] = attrValue.replace(/\s+/g, ' ').trim();
                    return;
                }

                if (
                    isEventHandler(attrName)
                ) {
                    newAttrs[attrName] = attrValue.trim();
                } else if (node.tag && attributesWithSingleValue.has(attrName)) {
                    const tagSet = attributesWithSingleValue.get(attrName)!;
                    if (tagSet.size === 0 || tagSet.has(node.tag)) {
                        newAttrs[attrName] = attrValue.trim();
                    }
                }
            });

            return newAttrs;
        };
    }
};

export default mod;
