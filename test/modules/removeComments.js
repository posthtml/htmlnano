import { init } from '../htmlnano';
import safePreset from '../../lib/presets/safe';
import maxPreset from '../../lib/presets/max';


describe('removeComments', () => {
    context('safe (default)', () => {
        const options = {
            removeComments: safePreset.removeComments,
        };

        it('should remove HTML comments', () => {
            return init(
                '<div><!-- hello --></div> <!-- oo -->',
                '<div></div> ',
                options
            );
        });

        it('should not remove <!--noindex--> and <!--/noindex-->', () => {
            return init(
                '<!--noindex-->this text will not be indexed<!--/noindex-->',
                '<!--noindex-->this text will not be indexed<!--/noindex-->',
                options
            );
        });

        it('should not remove <!--sse--> and <!--/sse-->', () => {
            return init(
                '<!--sse-->Bad visitors won\'t see my phone number, 555-555-5555<!--/sse-->',
                '<!--sse-->Bad visitors won\'t see my phone number, 555-555-5555<!--/sse-->',
                options
            );
        });

        it('should not remove conditional comments <!--[if expression]>..<![endif]-->', () => {
            return init(
                '<!--[if IE 8]><link href="ie8only.css" rel="stylesheet"><![endif]-->',
                '<!--[if IE 8]><link href="ie8only.css" rel="stylesheet"><![endif]-->',
                options
            );
        });

        it('should not remove excerpt comments <!-- more -->', () => {
            return init(
                'Lorem ipsum dolor sit amet <!-- more --> consectetur adipiscing elit',
                'Lorem ipsum dolor sit amet <!-- more --> consectetur adipiscing elit',
                options
            );
        });
    });


    context('all', () => {
        const options = {
            removeComments: maxPreset.removeComments,
        };

        it('should remove <!--noindex--> and <!--/noindex-->', () => {
            return init(
                '<!--noindex-->this text will not be indexed<!--/noindex-->',
                'this text will not be indexed',
                options
            );
        });

        it('should remove <!--sse--> and <!--/sse-->', () => {
            return init(
                '<!--sse-->Bad visitors won\'t see my phone number, 555-555-5555<!--/sse-->',
                'Bad visitors won\'t see my phone number, 555-555-5555',
                options
            );
        });

        it('should remove conditional comments', () => {
            return init(
                '<!--[if IE 8]><link href="ie8only.css" rel="stylesheet"><![endif]-->',
                '',
                options
            );
        });

        it('should remove excerpt comments <!-- more -->', () => {
            return init(
                'Lorem ipsum dolor sit amet <!-- more --> consectetur adipiscing elit',
                'Lorem ipsum dolor sit amet  consectetur adipiscing elit',
                options
            );
        });
    });

    context('custom matcher', () => {
        it('RegExp', () => {
            return init(
                '<!--noindex-->this text will not be indexed<!--/noindex-->Lorem ipsum dolor sit amet<!--more-->Lorem ipsum dolor sit amet',
                'this text will not be indexedLorem ipsum dolor sit amet<!--more-->Lorem ipsum dolor sit amet',
                {
                    removeComments: /<!--(\/)?noindex-->/,
                }
            );
        });

        it('Function', () => {
            return init(
                '<!--noindex-->this text will not be indexed<!--/noindex-->Lorem ipsum dolor sit amet<!--more-->Lorem ipsum dolor sit amet',
                'this text will not be indexedLorem ipsum dolor sit amet<!--more-->Lorem ipsum dolor sit amet',
                {
                    removeComments: (comments) => {
                        if (comments.includes('noindex')) return true;
                        return false;
                    },
                }
            );
        });
    });
});
