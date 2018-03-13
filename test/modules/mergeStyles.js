import { init } from '../htmlnano';


describe('mergeStyles', () => {
    const options = {mergeStyles: true};

    it('should merge multiple <style> with the same "type" and "media" into one', () => {
        return init(
            '<style>h1 { color: red }</style>' +
            '<div>hello</div>' +
            '<style media="print">div { color: blue }</style>' +
            '<style>div { font-size: 20px }</style>' +
            '<style type="text/css" media="print">a {}</style>',

            '<style>h1 { color: red } div { font-size: 20px }</style>' +
            '<div>hello</div>' +
            '<style media="print">div { color: blue } a {}</style>',

            options
        );
    });


    it('should skip <style> with the "scoped" attribute', () => {
        const html = `<style>h1 { color: red }</style>
                      <div></div>
                      <style scoped="scoped">div { color: blue }</style>`;
        return init(
            html, html, options
        );
    });
});
