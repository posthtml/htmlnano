import expect from 'expect';
import posthtml from 'posthtml';
import htmlnano from '..';


describe('Usage', () => {
    const html = ' <div><!-- foo --></div> ';
    const minifiedHtml = '<div></div>';


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
