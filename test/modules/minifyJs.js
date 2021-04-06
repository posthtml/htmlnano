import { init } from '../htmlnano';
import safePreset from '../../lib/presets/safe';
import ampSafePreset from '../../lib/presets/ampSafe';


describe('minifyJs', () => {
    const options = {
        minifyJs: safePreset.minifyJs,
    };

    it('should minify JS inside <script>', () => {
        return init(
            `<div>
                <script> /* test */ var foob = function () {}; </script>
                <script type="module"> /* test */ var foob = function () {}; </script>
                <script type="text/javascript"> /* test */ var foob = function () {}; </script>
                <script type="application/javascript"> /* test */ var foob = function () {}; </script>
             </div>`,

            `<div>
                <script>var foob=function(){};</script>
                <script type="module">var foob=function(){};</script>
                <script type="text/javascript">var foob=function(){};</script>
                <script type="application/javascript">var foob=function(){};</script>
             </div>`,

            options
        );
    });

    it('should minify ES6 inside <script>', () => {
        return init(
            `<script>
                const f  =  5 + 10;
                let a = (b) => { return b * 5; };
            </script>`,
            '<script>const f=15;let a=t=>5*t;</script>',
            options,
        );
    });

    it('should minify JS inside on* attributes', () => {
        return init(
            '<a href="#" onclick="return function () {};">click</a>',
            '<a href="#" onclick="return function(){}">click</a>',
            options
        );
    });

    it('should not minify JS inside HTML comments', () => {
        return init(
            '<div><!-- <script> var foob = function () {}; </script> --></div>',
            '<div><!-- <script> var foob = function () {}; </script> --></div>',
            options
        );
    });

    it('should skip <script> with non JS media type', () => {
        return init(
            '<script type="application/json">var foob = function () {};</script>',
            '<script type="application/json">var foob = function () {};</script>',
            options
        );
    });

    it('should pass minifyJs options to Terser', () => {
        return init(
            '<script>foo["bar"] = 5;</script>',
            '<script>foo["bar"]=5;</script>',
            Object.assign({}, options, {
                minifyJs: {
                    compress: {
                        properties: false,
                    },
                }
            })
        );
    });

    // This test fails.
    // For more info see https://github.com/posthtml/htmlnano/issues/41
    it.skip('should not break quotes inside on* attributes code', () => {
        return init(
            `<a href="#" onclick="myFunc('my string')"></a>
            <a href="#" onclick='myFunc("my string")'></a>`,

            `<a href="#" onclick="myFunc('my string')"></a>
            <a href="#" onclick='myFunc("my string")'></a>`,
            options
        );
    });


    it('should not minify inline JS on AMP pages', () => {
        return init(
            '<button on="tap:something">Click</button>',
            '<button on="tap:something">Click</button>',
            {minifyJs: ampSafePreset.minifyJs}
        );
    });

    it('should keep JS inside SVG wrapped in CDATA', () => {
        return init(
            `<svg><script>
                // <![CDATA[
                const x = "test" + "2";
                //  ]]>
            </script></svg>
            <svg><script>
                /* <![CDATA[  */
                const x = "test" + "2";
                /* ]]>*/
            </script></svg>`,
            `<svg><script>/*<![CDATA[*/const x="test2";/*]]>*/</script></svg>
            <svg><script>/*<![CDATA[*/const x="test2";/*]]>*/</script></svg>`,
            options
        );
    });
});
