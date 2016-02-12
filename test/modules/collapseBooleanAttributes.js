import { init } from '../htmlnano';


describe('collapseBooleanAttributes', () => {
    const options = {collapseBooleanAttributes: true};

    it('should collapse a boolean attribute with value', () => {
        return init(
            '<button disabled="disabled">click</button>',
            '<button disabled>click</button>',
            options
        );
    });


    it('should collapse a boolean attribute with empty value', () => {
        return init(
            '<script defer=""></script>',
            '<script defer></script>',
            options
        );
    });


    it('should not collapse non boolean attribute', () => {
        return init(
            '<a href="">link</a>',
            '<a href="">link</a>',
            options
        );
    });
});
