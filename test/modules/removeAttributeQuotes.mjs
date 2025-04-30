import { init } from '../htmlnano.mjs';
import safePreset from '../../dist/presets/safe.mjs';

import posthtml from 'posthtml';
import htmlnano from '../../dist/index.mjs';
import { expect } from 'expect';

describe('removeAttributeQuotes', () => {
    const options = { ...safePreset, removeAttributeQuotes: true };
    const html = '<div class="foo" title="hello world"></div>';

    it('default behavior', () => {
        return init(
            html,
            '<div class=foo title="hello world"></div>',
            options
        );
    });

    it('shouldn\'t override exists options', () => {
        return posthtml([
            htmlnano(options, {})
        ]).process(
            html,
            { quoteAllAttributes: true }
        ).then((result) => {
            expect(result.html).toBe(html);
        });
    });
});
