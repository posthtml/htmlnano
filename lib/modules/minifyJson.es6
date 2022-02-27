const rNodeAttrsTypeJson = /(\/|\+)json/;

export function onContent() {
    return (content, node) => {
        let newContent = content;
        if (node.attrs && node.attrs.type && rNodeAttrsTypeJson.test(node.attrs.type)) {
            try {
                newContent = JSON.stringify(JSON.parse((content || []).join('')));
            } catch (error) {
                // Invalid JSON
            }
        }

        return newContent;
    };
}
