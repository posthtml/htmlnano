import { init } from '../htmlnano';

describe('collapseWhitespace', () => {
    const html = ` <div>
            <b> hello  world! </b>
      </div>  `;


    context('all (default)', () => {
        const options = {collapseWhitespace: true};

        it('should collapse redundant whitespaces', () => {
            return init(
                html,
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


    context('conservative', () => {
        it('should collapse to 1 space', () => {
            return init(
                html,
                ' <div> <b> hello world! </b> </div> ',
                {collapseWhitespace: 'conservative'}
            );
        });
    });
});
