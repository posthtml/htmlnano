import { init } from '../htmlnano';
import safePreset from '../../lib/presets/safe';


describe('collapseAttributeWhitespace', () => {
    const options = {
        collapseAttributeWhitespace: safePreset.collapseAttributeWhitespace,
    };

    it('it should collapse whitespaces inside list-like attributes', () => {
        return init(
            '<a class=" foo  bar baz ">click</a>',
            '<a class="foo bar baz">click</a>',
            options
        );
    });

    it('should not alter non-list-like attributes', () => {
        return init(
            '<a id=" foo  bar " href=" baz  bar ">click</a>',
            '<a id=" foo  bar " href=" baz  bar ">click</a>',
            options
        );
    });
});
