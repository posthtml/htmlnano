const { expect } = require('expect');
const posthtml = require('posthtml');
const htmlnano = require('../dist/index.js');

describe('[commonjs usage]', () => {
    const html = ' <div><!-- foo --><i>Hello</i> <i>world!</i></div> ';
    const minifiedHtml = '<div><i>Hello</i> <i>world!</i></div>';

    it('javascript', () => {
        return htmlnano.process(html).then((result: any) => {
            expect(result.html).toBe(minifiedHtml);
        });
    });

    it('PostHTML plugin', () => {
        return posthtml([htmlnano()]).process(html).then((result: any) => {
            expect(result.html).toBe(minifiedHtml);
        });
    });
});
