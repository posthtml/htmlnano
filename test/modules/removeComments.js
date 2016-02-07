import { init } from '../htmlnano';

describe('removeComments', () => {
    context('safe (default)', () => {
        const options = {removeComments: true};

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

        it('should not remove conditional comments <!--[if expression]>..<![endif]-->', () => {
            return init(
                '<!--[if IE 8]><link href="ie8only.css" rel="stylesheet"><![endif]-->',
                '<!--[if IE 8]><link href="ie8only.css" rel="stylesheet"><![endif]-->',
                options
            );
        });
    });


    context('all', () => {
        const options = {removeComments: 'all'};

        it('should remove <!--noindex--> and <!--/noindex-->', () => {
            return init(
                '<!--noindex-->this text will not be indexed<!--/noindex-->',
                'this text will not be indexed',
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
    });
});
