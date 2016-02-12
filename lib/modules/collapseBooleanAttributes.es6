// Source: https://github.com/kangax/html-minifier/issues/63
const booleanAttributes = [
    'allowfullscreen',
    'async',
    'autofocus',
    'autoplay',
    'checked',
    'compact',
    'controls',
    'declare',
    'default',
    'defaultchecked',
    'defaultmuted',
    'defaultselected',
    'defer',
    'disabled',
    'enabled',
    'formnovalidate',
    'hidden',
    'indeterminate',
    'inert',
    'ismap',
    'itemscope',
    'loop',
    'multiple',
    'muted',
    'nohref',
    'noresize',
    'noshade',
    'novalidate',
    'nowrap',
    'open',
    'pauseonexit',
    'readonly',
    'required',
    'reversed',
    'scoped',
    'seamless',
    'selected',
    'sortable',
    'truespeed',
    'typemustmatch',
    'visible'
];


let booleanAttributesIndex = {};
booleanAttributes.forEach(attributeName => booleanAttributesIndex[attributeName] = true);

export default function collapseBooleanAttributes(tree) {
    tree.match({attrs: true}, node => {
        for (let attrName of Object.keys(node.attrs)) {
            if (booleanAttributesIndex[attrName]) {
                node.attrs[attrName] = true;
            }
        }

        return node;
    });

    return tree;
}
