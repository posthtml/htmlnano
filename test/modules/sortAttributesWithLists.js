import { init } from '../htmlnano';
import safePreset from '../../lib/presets/safe';

describe('sortAttributesWithLists', () => {
    const options = {
        sortAttributesWithLists: safePreset.sortAttributesWithLists,
    };

    it('it sort values from list-like attributes', () => {
        return init(
            '<a class="foo baz bar">click</a>',
            '<a class="bar baz foo">click</a>',
            options
        );
    });
});
