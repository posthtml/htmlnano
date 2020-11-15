import { init } from '../htmlnano';
import safePreset from '../../lib/presets/safe';
import maxPreset from '../../lib/presets/max';


describe('minifySvg', () => {
    const options = {
        minifySvg: safePreset.minifySvg,
    };
    const svg = `<svg version="1.1" baseProfile="full" width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <g>
            <rect width="100%" height="100%" fill="red" />

            <circle cx="150" cy="100" r="80" fill="green" />

            <text id="myText" x="150" y="125" font-size="60" text-anchor="middle" fill="white">SVG</text>

            <use href="#myText" x="2" y="2"></use>
        </g>
    </svg>`;

    const svgContainsCDATA = `<svg xmlns='http://www.w3.org/2000/svg'>
        <style><![CDATA[
            .label {
                color: red
            }
        ]]></style>
        <text class="label">example</text>
        <text class="label">example</text>
    </svg>
    <svg xmlns='http://www.w3.org/2000/svg'>
        <script>//<![CDATA[
            const x = '<>';
        //]]></script>
    </svg>`;

    it('should minify SVG inside <svg>', () => {
        return init(
            svg,

            '<svg baseProfile="full" width="300" height="200" xmlns="http://www.w3.org/2000/svg"><g><rect width="100%" height="100%" fill="red"/><circle cx="150" cy="100" r="80" fill="green"/><text id="a" x="150" y="125" font-size="60" text-anchor="middle" fill="#fff">SVG</text><use href="#a" x="2" y="2"/></g></svg>',

            options
        );
    });

    it('should not minify SVG colors if this option is disabled', () => {
        return init(
            svg,

            '<svg baseProfile="full" width="300" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="red"/><circle cx="150" cy="100" r="80" fill="green"/><text id="a" x="150" y="125" font-size="60" text-anchor="middle" fill="white">SVG</text><use href="#a" x="2" y="2"/></svg>',

            {
                minifySvg: {
                    plugins: [
                        { convertColors: false }
                    ]
                }
            }
        );
    });

    it('should collapse useless <g> groups with max preset', () => {
        return init(
            svg,

            '<svg baseProfile="full" width="300" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="red"/><circle cx="150" cy="100" r="80" fill="green"/><text id="a" x="150" y="125" font-size="60" text-anchor="middle" fill="#fff">SVG</text><use href="#a" x="2" y="2"/></svg>',

            {minifySvg: maxPreset.minifySvg}
        );
    });

    // https://github.com/posthtml/htmlnano/issues/88
    it('should work with <svg> with <script> inside (issue #88)', () => {
        return init(
            svgContainsCDATA,
            // The CDATA inside <style> has been stripped by SVGO, because SVGO determines that there is no CSS that needs to be escaped, thus no CDATA is required.
            '<svg xmlns="http://www.w3.org/2000/svg"><style>.label{color:red}</style><text class="label">example</text><text class="label">example</text></svg>\n    <svg xmlns="http://www.w3.org/2000/svg"><script>/*<![CDATA[*/const x="<>";/*]]>*/</script></svg>',

            {
                minifyCss: {
                    preset: 'default',
                },
                minifyJs: {},
                minifySvg: maxPreset.minifySvg
            }
        );
    });
});
