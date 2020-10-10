import { init } from '../htmlnano';
import safePreset from '../../lib/presets/safe';
import maxPreset from '../../lib/presets/max';
import ampSafePreset from '../../lib/presets/ampSafe';

describe('minifyUrls', () => {
    it('shouldn\'t be enabled with safe preset', () => {
        const html = '<a href="https://example.com/foo/bar/baz">bar</a>';
        init(html, html, safePreset);
    });

    it('shouldn\'t be enabled with max preset', () => {
        const html = '<a href="https://example.com/foo/bar/baz">bar</a>';
        init(html, html, maxPreset);
    });

    it('shouldn\'t be enabled with ampSafe preset', () => {
        const html = '<a href="https://example.com/foo/bar/baz">bar</a>';
        init(html, html, ampSafePreset);
    });

    it('shouldn\'t be enabled with invalid configuration', () => {
        const html = '<a href="https://example.com/foo/bar/baz">bar</a>';
        init(html, html, { ...safePreset, minifyUrls: 1000 });

        // "true" is not allowed since relateurl requires a URL instance for base
        init(html, html, { minifyUrls: true, ...safePreset });
    });

    it('should work with URL', () => {
        const html = '<a href="https://example.com/foo/bar/baz">bar</a>';
        const expected = '<a href="foo/bar/baz">bar</a>';

        init(
            html,
            expected,
            { ...safePreset, minifyUrls: new URL('https://example.com') }
        );
    });

    it('should work with string', () => {
        const html = '<a href="https://example.com/foo/bar/baz">bar</a>';
        const expected = '<a href="foo/bar/baz">bar</a>';

        init(
            html,
            expected,
            { ...safePreset, minifyUrls: 'https://example.com' }
        );
    });

    it('should work with sub-directory', () => {
        init(
            '<a href="https://example.com/foo/bar/baz">bar</a>',
            '<a href="bar/baz">bar</a>',
            { ...safePreset, minifyUrls: 'https://example.com/foo/' }
        );

        init(
            '<a href="https://example.com/foo/bar/index.html">bar</a>',
            '<a href="/foo/bar/">bar</a>',
            { ...safePreset, minifyUrls: 'https://example.com/bar/baz/' }
        );

        init(
            '<a href="https://example.com/foo/bar">bar</a>',
            '<a href="../bar">bar</a>',
            { ...safePreset, minifyUrls: 'https://example.com/foo/baz/' }
        );

        init(
            '<a href="https://example.com/foo/bar/baz">bar</a>',
            '<a href="/foo/bar/baz">bar</a>',
            { ...safePreset, minifyUrls: 'https://example.com/baz/' }
        );
    });

    it('shouldn\'t process link[rel=canonical] tag', () => {
        const html = '<link href="https://example.com/baz/" rel="canonical">';

        init(html, html, { ...safePreset, minifyUrls: 'https://example.com/' });
    });
});
