import { expect } from 'expect';
import posthtml from 'posthtml';
import htmlnano from '../index';
import safePreset from '../lib/presets/safe';
import ampSafePreset from '../lib/presets/ampSafe';
import maxPreset from '../lib/presets/max';
import { loadConfig } from '../lib/htmlnano';


describe('[htmlnano]', () => {
    it('should do nothing if all modules are disabled', () => {
        return init(
            ' <div>      <!-- t --> </div> ',
            ' <div>      <!-- t --> </div> '
        );
    });

    it('should throw an error if the module is not defined', () => {
        return init(
            '<div></div>',
            '<b></b>',
            { notDefinedModule: true }
        ).catch(error => {
            expect(error.message).toBe('Module "notDefinedModule" is not defined');
        });
    });

    it('getRequiredOptionalDependencies', () => {
        expect(htmlnano.getRequiredOptionalDependencies({
            minifyUrl: true,
            minifyJs: {}
        })).toStrictEqual(['relateurl', 'srcset', 'terser']);
    });

    it('htmlMinimizerWebpackPluginMinify', () => {
        return htmlnano.htmlMinimizerWebpackPluginMinify({
            'index.html': '<div></div>'
        }, {})
            .then(result => expect(result).toStrictEqual({
                code: '<div></div>'
            }));
    });

    it('should not treat skipConfigLoading as a module name', () => {
        return init('<div></div>', '<div></div>', { skipConfigLoading: true });
    });
});


describe('loadConfig()', () => {
    it('should return empty options and safe preset if nothing set', () => {
        expect(loadConfig()).toEqual([
            {},
            safePreset
        ]);
    });

    it('should not override the run options or preset', () => {
        expect(loadConfig({ foo: 'bar' }, ampSafePreset, './test/testrc.json')).toEqual([
            { foo: 'bar' },
            ampSafePreset
        ]);
    });

    it('should load options and preset from RC files', () => {
        expect(loadConfig(undefined, undefined, './test/testrc.json')).toEqual([
            { foo: 'baz' },
            maxPreset
        ]);
    });

    it('should not load options and preset from RC files if skipConfigLoading is true', () => {
        const options = { skipConfigLoading: true };
        const loaded = loadConfig(options, undefined, './test/testrc.json');

        expect(loaded).toEqual([{}, safePreset]);
        expect(options).toEqual({ skipConfigLoading: true });
    });
});


export function init(html, minifiedHtml, options) {
    return posthtml([htmlnano(options, {})]).process(html).then((result) => {
        expect(result.html).toBe(minifiedHtml);
    });
}
