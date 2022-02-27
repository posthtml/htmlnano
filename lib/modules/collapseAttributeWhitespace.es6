import { isEventHandler } from '../helpers';

export const attributesWithLists = new Set([
    'class',
    'dropzone',
    'rel', // a, area, link
    'ping', // a, area
    'sandbox', // iframe
    'sizes', // link
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
export function onAttrs() {
    return (attrs, node) => {
        const newAttrs = attrs;

        Object.entries(attrs).forEach(([attrName, attrValue]) => {
            if (attributesWithLists.has(attrName)) {
                const newAttrValue = attrValue.replace(/\s+/g, ' ').trim();
                newAttrs[attrName] = newAttrValue;
                return;
            }

            if (
                isEventHandler(attrName)
                || (
                    Object.hasOwnProperty.call(attributesWithSingleValue, attrName)
                    && (
                        attributesWithSingleValue[attrName] === null
                        || attributesWithSingleValue[attrName].includes(node.tag)
                    )
                )
            ) {
                newAttrs[attrName] = minifySingleAttributeValue(attrValue);
            }
        });

        return newAttrs;
    };
}

function minifySingleAttributeValue(value) {
    return typeof value === 'string' ? String(value).trim() : value;
}
