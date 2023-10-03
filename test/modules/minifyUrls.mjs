import { init } from '../htmlnano.mjs';
import safePreset from '../../lib/presets/safe.mjs';
import maxPreset from '../../lib/presets/max.mjs';
import ampSafePreset from '../../lib/presets/ampSafe.mjs';

describe('minifyUrls', () => {
    it('shouldn\'t be enabled with safe preset', () => {
        const html = '<a href="https://example.com/foo/bar/baz">bar</a>';
        return init(html, html, safePreset);
    });

    it('shouldn\'t be enabled with max preset', () => {
        const html = '<a href="https://example.com/foo/bar/baz">bar</a>';
        return init(html, '<a href=https://example.com/foo/bar/baz>bar</a>', maxPreset);
    });

    it('shouldn\'t be enabled with ampSafe preset', () => {
        const html = '<a href="https://example.com/foo/bar/baz">bar</a>';
        return init(html, html, ampSafePreset);
    });

    it('shouldn\'t be enabled with invalid configuration', () => {
        const html = '<a href="https://example.com/foo/bar/baz">bar</a>';
        return Promise.all([
            init(html, html, { ...safePreset, minifyUrls: 1000 }),
            // "true" is not allowed since relateurl requires a URL instance for base
            init(html, html, { ...safePreset, minifyUrls: true })
        ]);
    });

    it('should work with URL', () => {
        const html = '<a href="https://example.com/foo/bar/baz">bar</a>';
        const expected = '<a href="foo/bar/baz">bar</a>';

        return init(
            html,
            expected,
            { ...safePreset, minifyUrls: new URL('https://example.com') }
        );
    });

    it('should work with string', () => {
        const html = '<a href="https://example.com/foo/bar/baz">bar</a>';
        const expected = '<a href="foo/bar/baz">bar</a>';

        return init(
            html,
            expected,
            { ...safePreset, minifyUrls: 'https://example.com' }
        );
    });

    it('should work with sub-directory', () => {
        return Promise.all([
            init(
                '<a href="https://example.com/foo/bar/baz">bar</a>',
                '<a href="bar/baz">bar</a>',
                { ...safePreset, minifyUrls: 'https://example.com/foo/' }
            ),
            init(
                '<a href="https://example.com/foo/bar">bar</a>',
                '<a href="../bar">bar</a>',
                { ...safePreset, minifyUrls: 'https://example.com/foo/baz/' }
            ),
            init(
                '<a href="https://example.com/foo/bar/baz">bar</a>',
                '<a href="/foo/bar/baz">bar</a>',
                { ...safePreset, minifyUrls: 'https://example.com/baz/' }
            ),
            init(
                '<a href="https://example.com/foo/bar/index.html">bar</a>',
                '<a href="/foo/bar/">bar</a>',
                { ...safePreset, minifyUrls: 'https://example.com/bar/baz/' }
            )
        ]);
    });

    it('shouldn\'t process link[rel=canonical] tag', () => {
        const html = '<link href="https://example.com/baz/" rel="canonical">';

        return init(html, html, { ...safePreset, minifyUrls: 'https://example.com/' });
    });

    it('should process srcset', () => {
        return init(
            '<img srcset="https://example.com/foo/bar/image.png 1x, https://example.com/foo/bar/image2.png.png 2x">',
            '<img srcset="../bar/image.png 1x, ../bar/image2.png.png 2x">',
            { ...safePreset, minifyUrls: 'https://example.com/foo/baz/' }
        );
    });

    it('shouldn\'t process "invalid" srcset', () => {
        const html = '<img srcset="https://example.com/foo/bar/image.png 1y ,https://example.com/foo/bar/image2.png.png 2y">';

        return init(
            html,
            html,
            { ...safePreset, minifyUrls: 'https://example.com/foo/baz/' }
        );
    });

    it('should minify javascript url', () => {
        return init(
            '<img src="javascript:alert(true)">',
            '<img src="javascript:alert(!0)">',
            { ...safePreset, minifyUrls: 'https://example.com/foo/baz/' }
        );
    });
});
