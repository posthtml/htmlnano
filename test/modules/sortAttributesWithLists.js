import { init } from '../htmlnano';

describe('sortAttributesWithLists', () => {
    it('alphabetical', () => {
        return init(
            '<a class="foo baz bar">click</a><a class="foo bar">click</a>',
            '<a class="bar baz foo">click</a><a class="bar foo">click</a>',
            {
                sortAttributesWithLists: 'alphabetical',
            }
        );
    });

    it('frequency', () => {
        return init(
            '<div class="foo baz bar"></div><div class="bar foo"></div>',
            '<div class="foo bar baz"></div><div class="foo bar"></div>',
            {
                sortAttributesWithLists: 'frequency',
            }
        );
    });

    it('true (alphabetical)', () => {
        return init(
            '<a class="foo baz bar">click</a><a class="foo bar">click</a>',
            '<a class="bar baz foo">click</a><a class="bar foo">click</a>',
            {
                sortAttributesWithLists: true,
            }
        );
    });

    it('invalid configuration', () => {
        const input = '<a class="foo baz bar">click</a><a class="foo bar">click</a>';
        return init(
            input,
            input,
            {
                sortAttributesWithLists: 100,
            }
        );
    });
});
