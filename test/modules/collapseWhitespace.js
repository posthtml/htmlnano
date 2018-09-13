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
        const options = {collapseWhitespace: 'conservative'};

        it('should collapse to 1 space', () => {
            return init(
                html,
                '<div> <b> hello world! </b> </div>',
                options
            );
        });

        it('should collapse whitespaces between top-level tags (html, head, body)', () => {
            return init(
                ` <html>
                    <head>
                        <title> Test </title>
                        <script> </script>
                    </head>
                    <body>
                    </body>
                </html> `,
                '<html><head><title> Test </title><script> </script></head><body> </body></html>',
                options
            );
        });
    });
});
