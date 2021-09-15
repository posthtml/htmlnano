import { init } from '../htmlnano';
import safePreset from '../../lib/presets/safe';

describe('normalizeAttributeValues', () => {
    const options = safePreset;

    it('default behavior', () => {
        return init(
            '<form id="FOo" method="GET"></form>',
            '<form id="FOo" method="get"></form>',
            options
        );
    });
});
