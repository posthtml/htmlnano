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
            '<a class="foo baz bar">click</a><a class="foo bar">click</a>',
            '<a class="foo bar baz">click</a><a class="foo bar">click</a>',
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
});
