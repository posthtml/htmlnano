import { init } from '../minifier';

describe('collapseWhitespace', () => {
    const options = {collapseWhitespace: true};

    it('should collapse redundant whitespaces', () => {
        return init(
            ' <div> <b> hello  world! </b>    </div>  ',
            '<div><b>hello world!</b></div>',
            options
        );
    });

    it('should not collapse whitespaces inside <script>, <style>, <pre>, <textarea>', () => {
        return init(
            ' <script> alert() </script>  <style>.foo  {}</style> <pre> hello <b> , </b> </pre> <textarea> world! </textarea> ',
            '<script> alert() </script><style>.foo  {}</style><pre> hello <b> , </b> </pre><textarea> world! </textarea>',
            options
        );
    });
});
