import type { HtmlnanoModule } from '../types';

const rNodeAttrsTypeJson = /(\/|\+)json/;

const mod: HtmlnanoModule = {
    onContent() {
        return (content, node) => {
            // Skip SRI, reasons are documented in "minifyJs" module
            if (node.attrs && 'integrity' in node.attrs) {
                return content;
            }

            if (node.attrs && node.attrs.type && rNodeAttrsTypeJson.test(node.attrs.type)) {
                try {
                    // cast minified JSON to an array
                    let jsonContent = '';
                    for (let i = 0, len = content.length; i < len; i++) {
                        const item = content[i];
                        if (typeof item === 'string') {
                            jsonContent += item;
                        } else {
                            return content; // If any item is not a string, return original contents
                        }
                    }
                    return [JSON.stringify(JSON.parse(jsonContent))];
                } catch {
                    // Invalid JSON
                }
            }

            return content;
        };
    }
};

export default mod;
