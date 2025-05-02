import { init } from '../htmlnano.mjs';
import safePreset from '../../dist/presets/safe.mjs';

describe('normalizeAttributeValues', () => {
    const options = {
        normalizeAttributeValues: true
    };

    it('default behavior', () => {
        return init(
            '<form id="FOo" method="GET"></form>',
            '<form id="FOo" method="get"></form>',
            safePreset
        );
    });

    it('normalize invalid value default', () => {
        return Promise.all([
            // attribute on any tag
            init(
                '<img crossorigin="example">',
                '<img crossorigin="anonymous">',
                options
            ),
            // attribute on specific tag
            init(
                '<button type="example"></button><input type="example">',
                // button has invalid default value for submit
                // while input's invalid default value is ignored in out implementation
                '<button type="submit"></button><input type="example">',
                options
            ),
            // make sure case normalization is applied before invalid value default
            init(
                '<a referrerpolicy="uNSaFe-UrL"></a>',
                // should be lower case instead of invalid value default
                '<a referrerpolicy="unsafe-url"></a>',
                options
            )
        ]);
    });
});
