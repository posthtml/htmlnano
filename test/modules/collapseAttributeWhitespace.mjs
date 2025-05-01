import { init } from '../htmlnano.mjs';
import safePreset from '../../dist/presets/safe.mjs';

describe('collapseAttributeWhitespace', () => {
    const options = {
        collapseAttributeWhitespace: safePreset.collapseAttributeWhitespace
    };

    it('should collapse whitespaces inside list-like attributes', () => {
        return init(
            '<a class=" foo  bar baz ">click</a>',
            '<a class="foo bar baz">click</a>',
            options
        );
    });

    it('should collapse whitespaces inside single value attributes', () => {
        return init(
            '<a href="   https://example.com" style="display: none     ">click</a>',
            '<a href="https://example.com" style="display: none">click</a>',
            options
        );
    });

    it('should not alter non-list-like nor single value attributes', () => {
        return init(
            '<a id=" foo  bar " href=" baz  bar ">click</a>',
            '<a id=" foo  bar " href="baz  bar">click</a>',
            options
        );
    });
});
