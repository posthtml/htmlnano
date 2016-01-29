import { init } from '../htmlnano';

describe('minifyJs', () => {
    it('should minify JS inside <script>', () => {
        return init(
            '<div><script> /* test */ var foob = function () {}; </script></div>',
            '<div><script>var foob=function(){};</script></div>',
            {minifyJs: {}}
        );
    });
});
