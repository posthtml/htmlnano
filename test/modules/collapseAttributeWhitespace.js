import { init } from '../htmlnano';


describe('collapseAttributeWhitespace', () => {
    const options = {collapseAttributeWhitespace: {}};

    it('it should collapse whitespaces inside list-like attributes', () => {
        return init(
            '<a class=" foo  bar baz ">click</a>',
            '<a class="foo bar baz">click</a>',
            options
        );
    });

    it('should not collapse whitespaces inside non-list-like attributes', () => {
        return init(
            '<a id=" foo  bar " href=" baz  bar ">click</a>',
            '<a id=" foo  bar " href=" baz  bar ">click</a>',
            options
        );
    });
});
