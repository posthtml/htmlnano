import { init } from '../htmlnano.mjs';
import safePreset from '../../lib/presets/safe.mjs';


describe('minifyConditionalComments', () => {
    const fixture = {
        fullHtml: `
<!DOCTYPE html>
<html class="no-js">
    <head>
        <meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible">
        <meta charset="utf-8">
        <!--[if lte IE 7]>
            <style type="text/css">
                .title {
                    color: red;
                }
            </style>
        <![endif]-->
    </head>
</html>`,
        fullHtmlMinified: '<!DOCTYPE html><html class="no-js"><head><meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible"><meta charset="utf-8"><!--[if lte IE 7]><style type="text/css">.title{color:red}</style><![endif]--></head></html>',
        multipleConditionalComment: `
<!--[if lt IE 7 ]>
    <div class="ie6">
    </div>
<![endif]-->
<!--[if IE 7 ]>
    <div class="ie7">
    </div>
<![endif]-->
<!--[if IE 8 ]>
    <div class="ie8">
    </div>
<![endif]-->
<!--[if IE 9 ]>
    <div class="ie9">
    </div>
<![endif]-->
<!--[if (gt IE 9)|!(IE)]><!-->
    <div class="w3c">
    </div>
<!--<![endif]-->`,
        multipleConditionalCommentMinified: '<!--[if lt IE 7 ]><div class="ie6"> </div><![endif]--><!--[if IE 7 ]><div class="ie7"> </div><![endif]--><!--[if IE 8 ]><div class="ie8"> </div><![endif]--><!--[if IE 9 ]><div class="ie9"> </div><![endif]--><!--[if (gt IE 9)|!(IE)]><!--><div class="w3c"> </div><!--<![endif]-->',
        singleLineMultipleConditionalComment: `
<!--[if lt IE 7 ]><div class="ie6"></div><![endif]--><!--[if IE 7 ]><div class="ie7"></div><![endif]--><!--[if IE 8 ]><div class="ie8"></div><![endif]--><!--[if IE 9 ]><div class="ie9"></div><![endif]--><!--[if (gt IE 9)|!(IE)]><!--><div class="w3c"></div><!--<![endif]-->`,
        htmlTagIncludedConditionalComment: `
        <!--[if lt IE 7]><html class="no-js ie6"><![endif]-->
        <!--[if IE 7]><html class="no-js ie7"><![endif]-->
        <!--[if IE 8]><html class="no-js ie8"><![endif]-->
        <!--[if gt IE 8]><!--><html class="no-js"><!--<![endif]-->`,
        htmlTagIncludedConditionalCommentMinified: `
        <!--[if lt IE 7]><html class="no-js ie6"><![endif]-->
        <!--[if IE 7]><html class="no-js ie7"><![endif]-->
        <!--[if IE 8]><html class="no-js ie8"><![endif]-->
        <!--[if gt IE 8]><!--><html class="no-js"><!--<![endif]--></html>`
    };

    it('common html', () => {
        return init(
            fixture.fullHtml,
            fixture.fullHtmlMinified,
            {
                ...safePreset,
                minifyConditionalComments: true
            }
        );
    });

    it('multiple conditional comment', () => {
        return init(
            fixture.multipleConditionalComment,
            fixture.multipleConditionalCommentMinified,
            {
                ...safePreset,
                minifyConditionalComments: true
            }
        );
    });

    it('multiple conditional comment in single line', () => {
        return init(
            fixture.singleLineMultipleConditionalComment,
            fixture.singleLineMultipleConditionalComment,
            {
                minifyConditionalComments: true
            }
        );
    });

    it('<html> in conditional comment', () => {
        return init(
            fixture.htmlTagIncludedConditionalComment,
            fixture.htmlTagIncludedConditionalCommentMinified,
            {
                minifyConditionalComments: true
            }
        );
    });
});
