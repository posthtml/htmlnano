const redundantAttributes = {
    'form': {
        'method': 'get'
    },

    'input': {
        'type': 'text'
    },

    'script': {
        'language': 'javascript',
        'type': 'text/javascript',
        // Remove attribute if the function returns false
        'charset': node => {
            // The charset attribute only really makes sense on “external” SCRIPT elements:
            // http://perfectionkills.com/optimizing-html/#8_script_charset
            return node.attrs && ! node.attrs.src;
        }
    },

    'style': {
        'media': 'all'
    },

    'link': {
        'media': 'all'
    }
};


/** Removes redundant attributes */
export default function removeRedundantAttributes(tree) {
    const tags = Object.keys(redundantAttributes);
    const tagMatchRegExp = new RegExp('^(' + tags.join('|') + ')$');
    tree.match({tag: tagMatchRegExp}, node => {
        const tagRedundantAttributes = redundantAttributes[node.tag];
        node.attrs = node.attrs || {};
        for (let redundantAttributeName of Object.keys(tagRedundantAttributes)) {
            let tagRedundantAttributeValue = tagRedundantAttributes[redundantAttributeName];
            let isRemove = false;
            if (typeof tagRedundantAttributeValue === 'function') {
                isRemove = tagRedundantAttributeValue(node);
            } else if (node.attrs[redundantAttributeName] === tagRedundantAttributeValue) {
                isRemove = true;
            }

            if (isRemove) {
                delete node.attrs[redundantAttributeName];
            }
        }

        return node;
    });

    return tree;
}
