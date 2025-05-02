import { init } from '../htmlnano.mjs';

describe('sortAttributes', () => {
    it('alphabetical', () => {
        return init(
            '<input type="text" class="form-control" name="testInput" autofocus="" autocomplete="off" id="testId">',
            '<input autocomplete="off" autofocus="" class="form-control" id="testId" name="testInput" type="text">',
            {
                sortAttributes: 'alphabetical'
            }
        );
    });

    it('frequency', () => {
        return init(
            '<input type="text" class="form-control" name="testInput" autofocus="" autocomplete="off" id="testId"><a id="testId" href="#" class="testClass"></a><img width="20" src="../images/image.png" height="40" alt="image" class="cls" id="id2">',
            '<input class="form-control" id="testId" type="text" name="testInput" autofocus="" autocomplete="off"><a class="testClass" id="testId" href="#"></a><img class="cls" id="id2" width="20" src="../images/image.png" height="40" alt="image">',
            {
                sortAttributes: 'frequency'
            }
        );
    });

    it('true (alphabetical)', () => {
        return init(
            '<input type="text" class="form-control" name="testInput" autofocus="" autocomplete="off" id="testId">',
            '<input autocomplete="off" autofocus="" class="form-control" id="testId" name="testInput" type="text">',
            {
                sortAttributes: true
            }
        );
    });

    it('invalid configuration', () => {
        const input = '<input type="text" class="form-control" name="testInput" autofocus="" autocomplete="off" id="testId">';

        return init(input, input, {
            sortAttributes: 100
        });
    });

    // https://github.com/posthtml/htmlnano/issues/189
    it('issue #189', () => {
        return init(
            '<input id="name" name="name" autocomplete="name" type="text" required="">',
            '<input id="name" name="name" autocomplete="name" type="text" required="">',
            {
                sortAttributes: 'frequency'
            }
        );
    });
});
