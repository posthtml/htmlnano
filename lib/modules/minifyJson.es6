/* Minify JSON inside <script type="application/json"></script> */
export default function minifyJson(tree) {
    tree.match({tag: 'script', attrs: {type: 'application/json'}}, node => {
        let content = (node.content || []).join('');
        if (! content) {
            return node;
        }

        try {
            content = JSON.stringify(JSON.parse(content));
        } catch (error) {
            return node;
        }

        node.content = [content];
        return node;
    });

    return tree;
}
