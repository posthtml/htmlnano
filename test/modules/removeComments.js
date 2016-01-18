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
    });

    context('all', () => {
        it('should remove <!--noindex--> and <!--/noindex-->', () => {
            return init(
                '<!--noindex-->this text will not be indexed<!--/noindex-->',
                'this text will not be indexed',
                {removeComments: 'all'}
            );
        });
    });
});
