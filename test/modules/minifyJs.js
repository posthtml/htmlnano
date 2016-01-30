import { init } from '../htmlnano';

describe('minifyJs', () => {
    const options = {minifyJs: {}};

    it('should minify JS inside <script>', () => {
        return init(
            '<div><script> /* test */ var foob = function () {}; </script></div>',
            '<div><script>var foob=function(){};</script></div>',
            options
        );
    });

    it('should minify JS inside on* attributes', () => {
        return init(
            '<a href="#" onclick="return function () {};">click</a>',
            '<a href="#" onclick="return function(){}">click</a>',
            options
        );
    });
});
