import { init } from '../htmlnano';

describe('removeComments', () => {
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
