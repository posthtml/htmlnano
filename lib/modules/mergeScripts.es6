/* Merge multiple <script> into one */
export default function mergeScripts(tree) {
    let scriptNodesIndex = {};

    tree.match({tag: 'script'}, node => {
        const nodeAttrs = node.attrs || {};
        if (nodeAttrs.src) {
            return node;
        }

        const scriptType = nodeAttrs.type || 'text/javascript';
        if (scriptType !== 'text/javascript' && scriptType !== 'application/javascript') {
            return node;
        }

        const scriptKey = JSON.stringify({
            id: nodeAttrs.id,
            class: nodeAttrs.class,
            type: scriptType,
            defer: nodeAttrs.defer !== undefined,
            async: nodeAttrs.async !== undefined
        });
        if (! scriptNodesIndex[scriptKey]) {
            scriptNodesIndex[scriptKey] = [];
        }

        scriptNodesIndex[scriptKey].push(node);
        return node;
    });

    for (let scriptKey of Object.keys(scriptNodesIndex)) {
        let scriptNodes = scriptNodesIndex[scriptKey];
        let lastScriptNode = scriptNodes.pop();
        scriptNodes.reverse().forEach(scriptNode => {
            let scriptContent = (scriptNode.content || []).join(' ');
            scriptContent = scriptContent.trim();
            if (scriptContent.slice(-1) !== ';') {
                scriptContent += ';';
            }

            lastScriptNode.content.unshift(scriptContent);

            scriptNode.tag = false;
            scriptNode.content = [];
        });
    }

    return tree;
}
