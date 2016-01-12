import { init } from '../minifier';

describe('removeComments', () => {
    it('should remove HTML comments', () => {
        return init(
            '<div><!-- hello --></div> <!-- oo -->',
            '<div></div> ',
            {removeComments: true}
        );
    });
});
