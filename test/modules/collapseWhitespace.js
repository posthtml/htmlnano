import { init } from '../htmlnano';

describe('collapseWhitespace', () => {
    const html = ` <div>
            <b> hello  world! </b>
      </div>  `;


    context('all', () => {
        const options = {collapseWhitespace: 'all'};

        it('should collapse redundant whitespaces', () => {
            return init(
                html,
                '<div><b>hello world!</b></div>',
                options
            );
        });

        it('should not collapse whitespaces inside comments, <script>, <style>, <pre>, <textarea>', () => {
            return init(
                `<script> alert() </script>  <style>.foo  {}</style> <pre> hello <b> , </b> </pre>
                  <div> <!--  hello   world  --> </div>
                  <textarea> world! </textarea>`,
                '<script> alert() </script><style>.foo  {}</style><pre> hello <b> , </b> </pre>' +
                '<div><!--  hello   world  --></div><textarea> world! </textarea>',
                options
            );
        });
    });


    context('conservative (default)', () => {
        it('should collapse to 1 space', () => {
            return init(
                html,
                '<div> <b> hello world! </b> </div>',
                {collapseWhitespace: 'conservative'}
            );
        });
    });
});
