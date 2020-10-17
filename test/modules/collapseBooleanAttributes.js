import { init } from '../htmlnano';
import safePreset from '../../lib/presets/safe';
import ampSafePreset from '../../lib/presets/ampSafe';


describe('collapseBooleanAttributes', () => {
    const options = {
        collapseBooleanAttributes: safePreset.collapseBooleanAttributes,
    };

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


    it('should collapse AMP boolean attributes with empty value', () => {
        const optionsWithAmp = {
            collapseBooleanAttributes: ampSafePreset.collapseBooleanAttributes,
        };

        return init(
            '<script defer=""></script>' +
            '<style amp-custom=""></style>' +
            '<amp-video preload="metadata"></amp-video>',

            '<script defer></script>' +
            '<style amp-custom></style>' +
            '<amp-video preload="metadata"></amp-video>',

            optionsWithAmp
        );
    });


    it('should not collapse A-Frame visible attribute', () => {
        return init(
            '<a-entity visible="false"></a-entity>',
            '<a-entity visible="false"></a-entity>',
            options
        );
    });

    it('should collapse crossorigin=anonymous attribute', () => {
        return init(
            '<script src="example-framework.js" crossorigin="anonymous"></script>',
            '<script src="example-framework.js" crossorigin></script>',
            options
        );
    });

    it('should collapse crossorigin="" attribute', () => {
        return init(
            '<script src="example-framework.js" crossorigin=""></script>',
            '<script src="example-framework.js" crossorigin></script>',
            options
        );
    });

    it('should not collapse crossorigin="use-credentials" attribute', () => {
        return init(
            '<script src="example-framework.js" crossorigin="use-credentials"></script>',
            '<script src="example-framework.js" crossorigin="use-credentials"></script>',
            options
        );
    });
});
