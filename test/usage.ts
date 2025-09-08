import { expect } from 'expect';
import posthtml from 'posthtml';
import htmlnano from '../dist/index.mjs';

describe('[usage]', () => {
    const html = ' <div><!-- foo --><i>Hello</i> <i>world!</i></div> ';
    const minifiedHtml = '<div><i>Hello</i> <i>world!</i></div>';

    it('javascript', () => {
        return htmlnano.process(html).then((result) => {
            expect(result.html).toBe(minifiedHtml);
        });
    });

    it('javascript - pass render options', () => {
        return htmlnano.process('<DIV class="foo"><!-- bar --></DIV>', {}, undefined, {
            lowerCaseTags: true, // posthtml-parser option
            quoteAllAttributes: false // posthtml-render option
        }).then((result) => {
            expect(result.html).toBe('<div class=foo></div>');
        });
    });

    it('PostHTML plugin', () => {
        return posthtml([htmlnano()]).process(html).then((result) => {
            expect(result.html).toBe(minifiedHtml);
        });
    });
});
