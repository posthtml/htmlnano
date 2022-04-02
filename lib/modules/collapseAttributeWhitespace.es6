import { isEventHandler } from '../helpers';

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

/** @type Record<string, string[] | null> */
const attributesWithSingleValue = {
    accept: ['input'],
    action: ['form'],
    accesskey: null,
    'accept-charset': ['form'],
    cite: ['blockquote', 'del', 'ins', 'q'],
    cols: ['textarea'],
    colspan: ['td', 'th'],
    data: ['object'],
    dropzone: null,
    formaction: ['button', 'input'],
    height: ['canvas', 'embed', 'iframe', 'img', 'input', 'object', 'video'],
    high: ['meter'],
    href: ['a', 'area', 'base', 'link'],
    itemid: null,
    low: ['meter'],
    manifest: ['html'],
    max: ['meter', 'progress'],
    maxlength: ['input', 'textarea'],
    media: ['source'],
    min: ['meter'],
    minlength: ['input', 'textarea'],
    optimum: ['meter'],
    ping: ['a', 'area'],
    poster: ['video'],
    profile: ['head'],
    rows: ['textarea'],
    rowspan: ['td', 'th'],
    size: ['input', 'select'],
    span: ['col', 'colgroup'],
    src: [
        'audio',
        'embed',
        'iframe',
        'img',
        'input',
        'script',
        'source',
        'track',
        'video'
    ],
    start: ['ol'],
    step: ['input'],
    style: null,
    tabindex: null,
    usemap: ['img', 'object'],
    value: ['li', 'meter', 'progress'],
    width: ['canvas', 'embed', 'iframe', 'img', 'input', 'object', 'video']
};

/** Collapse whitespaces inside list-like attributes (e.g. class, rel) */
export default function collapseAttributeWhitespace(tree) {
    tree.walk(node => {
        if (!node.attrs) {
            return node;
        }

        Object.entries(node.attrs).forEach(([attrName, attrValue]) => {
            const attrNameLower = attrName.toLowerCase();

            if (attributesWithLists.has(attrNameLower)) {
                const newAttrValue = attrValue.replace(/\s+/g, ' ').trim();
                node.attrs[attrName] = newAttrValue;

                return node;
            }

            if (
                isEventHandler(attrNameLower)
                || (
                    Object.hasOwnProperty.call(attributesWithSingleValue, attrNameLower)
                    && (
                        attributesWithSingleValue[attrNameLower] === null
                        || attributesWithSingleValue[attrNameLower].includes(node.tag)
                    )
                )
            ) {
                node.attrs[attrName] = minifySingleAttributeValue(attrValue);

                return node;
            }
        });

        return node;
    });

    return tree;
}

function minifySingleAttributeValue(value) {
    return typeof value === 'string' ? String(value).trim() : value;
}
