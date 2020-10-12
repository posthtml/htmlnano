import { init } from '../htmlnano';
import safePreset from '../../lib/presets/safe';

import posthtml from 'posthtml';
import htmlnano from '../..';
import expect from 'expect';

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
