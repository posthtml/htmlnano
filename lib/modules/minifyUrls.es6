import relateUrl from 'relateurl';

// Adopts from https://github.com/kangax/html-minifier/blob/51ce10f4daedb1de483ffbcccecc41be1c873da2/src/htmlminifier.js#L209-L221
const tagsHaveUriValuesForAttributes = new Set([
    'a',
    'area',
    'link',
    'base',
    'img',
    'object',
    'q',
    'blockquote',
    'ins',
    'form',
    'input',
    'head',
    'script'
]);

const tagsHasHrefAttributes = new Set([
    'a',
    'area',
    'link',
    'base'
]);

const attributesOfImgTagHasUriValues = new Set([
    'src',
    'longdesc',
    'usemap'
]);

const attributesOfObjectTagHasUriValues = new Set([
    'classid',
    'codebase',
    'data',
    'usemap'
]);

const isUriTypeAttribute = (tag, attr) => {
    return (
        tagsHasHrefAttributes.has(tag) && attr === 'href' ||
        tag === 'img' && attributesOfImgTagHasUriValues.has(attr) ||
        tag === 'object' && attributesOfObjectTagHasUriValues.has(attr) ||
        tag === 'q' && attr === 'cite' ||
        tag === 'blockquote' && attr === 'cite' ||
        (tag === 'ins' || tag === 'del') && attr === 'cite' ||
        tag === 'form' && attr === 'action' ||
        tag === 'input' && (attr === 'src' || attr === 'usemap') ||
        tag === 'head' && attr === 'profile' ||
        tag === 'script' && (attr === 'src' || attr === 'for')
    );
};

const processModuleOptions = options => {
    // FIXME!
    // relateurl@1.0.0-alpha only supports URL while stable version (0.2.7) only supports string
    // should convert input into URL instance after relateurl@1 is stable
    if (options instanceof URL) return options.toString();

    if (typeof options === 'string') return options;

    return false;
};

const isLinkRelCanonical = ({ tag, attrs }) => {
    // Return false early for non-"link" tag
    if (tag !== 'link') return false;

    for (const [attrName, attrValue] of Object.entries(attrs)) {
        if (attrName.toLowerCase() === 'rel' && attrValue === 'canonical') return true;
    }

    return false;
};

/** Convert absolute url into relative url */
export default function minifyUrls(tree, options, moduleOptions) {
    const urlBase = processModuleOptions(moduleOptions);

    // Invalid configuration, return tree directly
    if (!urlBase) return tree;

    tree.walk(node => {
        if (!node.attrs) return node;

        // Return early for better performance
        if (!tagsHaveUriValuesForAttributes.has(node.tag)) return node;

        // Prevent link[rel=canonical] being processed
        // Can't be excluded by isUriTypeAttribute()
        if (isLinkRelCanonical(node)) return node;

        for (const [attrName, attrValue] of Object.entries(node.attrs)) {
            const attrNameLower = attrName.toLowerCase();

            if (!isUriTypeAttribute(node.tag, attrNameLower)) continue;

            // FIXME!
            // relateurl@1.0.0-alpha only supports URL while stable version (0.2.7) only supports string
            // the WHATWG URL API is very strict while attrValue might not be a valid URL
            // new URL should be used, and relateUrl#relate should be wrapped in try...catch after relateurl@1 is stable
            node.attrs[attrName] = relateUrl.relate(urlBase, attrValue);
        }

        return node;
    });

    return tree;
}
