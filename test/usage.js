import expect from 'expect';
import posthtml from 'posthtml';
import htmlnano from '..';


describe('[usage]', () => {
    const html = ' <div><!-- foo --><i>Hello</i> <i>world!</i></div> ';
    const minifiedHtml = '<div><i>Hello</i> <i>world!</i></div>';


    it('javascript', () => {
        return htmlnano.process(html).then((result) => {
            expect(result.html).toBe(minifiedHtml);
        });
    });


    it('PostHTML plugin', () => {
        return posthtml([htmlnano()]).process(html).then((result) => {
            expect(result.html).toBe(minifiedHtml);
        });
    });
});
