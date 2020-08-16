import { init } from '../htmlnano';
import safePreset from '../../lib/presets/safe';
import maxPreset from '../../lib/presets/max';


describe('collapseWhitespace', () => {
    const html = ` <div>
            <b> hello  world! </b><a>other link
	</a>
	  </div>  `;

    const documentationHtml = `<div>
    hello  world!
    	<a href="#">answer</a>
    <style>div  { color: red; }  </style>
		<main></main>
</div>`;

    const inviolateTags = 'comments, <script>, <style>, <pre>, <textarea>';
    const inviolateTagsHtml = `<script> alert() </script>  <style>.foo  {}</style> <pre> hello <b> , </b> </pre>
      <div> <!--  hello   world  --> </div>
	  <textarea> world! </textarea>`;

    const topLevelTags = 'top-level tags (html, head, body)';
    const topLevelTagsHtml = ` <html>
                    <head>
                        <title> Test </title>
                        <script> </script>
                    </head>
                    <body>
                    </body>
                </html> `;

    context('all', () => {
        const options = {
            collapseWhitespace: maxPreset.collapseWhitespace,
        };

        it('should collapse redundant whitespaces', () => {
            return init(
                html,
                '<div><b>hello world!</b><a>other link</a></div>',
                options
            );
        });
		
        it('should not collapse whitespaces inside ' + inviolateTags, () => {
            return init(
                inviolateTagsHtml,
                '<script> alert() </script><style>.foo  {}</style><pre> hello <b> , </b> </pre>' +
                '<div><!--  hello   world  --></div><textarea> world! </textarea>',
                options
            );
        });

        it('should collapse whitespaces between ' + topLevelTags, () => {
            return init(
                topLevelTagsHtml,
                '<html><head><title>Test</title><script> </script></head><body></body></html>',
                options
            );
        });

        it('renders the documentation example correctly', () => {
            return init(
                documentationHtml,
                '<div>hello world!<a href="#">answer</a><style>div  { color: red; }  </style><main></main></div>',
                options
            );
        });
    });
	
	
    context('aggressive', () => {
        const options = {
            collapseWhitespace: 'aggressive',
        };

        it('should collapse redundant whitespaces and eliminate indentation (tabs, newlines, etc)', () => {
            return init(
                html,
                '<div> <b> hello world! </b><a>other link</a> </div>',
                options
            );
        });

        it('should not collapse whitespaces inside ' + inviolateTags, () => {
            return init(
                inviolateTagsHtml,
                '<script> alert() </script><style>.foo  {}</style><pre> hello <b> , </b> </pre>' +
                '<div> <!--  hello   world  --> </div><textarea> world! </textarea>',
                options
            );
        });

        it('should collapse whitespaces between ' + topLevelTags, () => {
            return init(
                topLevelTagsHtml,
                '<html><head><title> Test </title><script> </script></head><body> </body></html>',
                options
            );
        });

        it('renders the documentation example correctly', () => {
            return init(
                documentationHtml,
                '<div> hello world! <a href="#">answer</a> <style>div  { color: red; }  </style><main></main></div>',
                options
            );
        });
    });


    context('conservative (default)', () => {
        const options = {
            collapseWhitespace: safePreset.collapseWhitespace,
        };

        it('should collapse to 1 space', () => {
            return init(
                html,
                '<div> <b> hello world! </b><a>other link </a> </div>',
                options
            );
        });

        it('should collapse whitespaces between ' + topLevelTags, () => {
            return init(
                topLevelTagsHtml,
                '<html><head><title> Test </title><script> </script></head><body> </body></html>',
                options
            );
        });

        it('should not collapse whitespaces inside ' + inviolateTags, () => {
            return init(
                inviolateTagsHtml,
                '<script> alert() </script><style>.foo  {}</style><pre> hello <b> , </b> </pre>' +
                '<div> <!--  hello   world  --> </div><textarea> world! </textarea>',
                options
            );
        });

        it('renders the documentation example correctly', () => {
            return init(
                documentationHtml,
                '<div> hello world! <a href="#">answer</a> <style>div  { color: red; }  </style> <main></main> </div>',
                options
            );
        });
    });
});
