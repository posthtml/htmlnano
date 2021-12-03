import { init } from '../htmlnano';
import maxPreset from '../../lib/presets/max';


describe('mergeStyles', () => {
    const options = {
        mergeStyles: maxPreset.mergeStyles,
    };

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


    it('should preserve amp-custom', () => {
        return init(
            '<style amp-custom>h1 { color: red }</style>' +
            '<div>hello</div>' +
            '<style amp-custom>div { color: blue }</style>',

            '<style amp-custom="">h1 { color: red } div { color: blue }</style>' +
            '<div>hello</div>',

            options
        );
    });


    it('should ignore AMP boilerplate', () => {
        const html = `<style>h1 { color: red }</style>
                      <div></div>
                      <style amp-boilerplate="">div { color: blue }</style>`;
        return init(
            html, html, options
        );
    });
});
