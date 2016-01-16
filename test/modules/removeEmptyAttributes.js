import { init } from '../htmlnano';

describe('removeEmptyAttributes', () => {
    it('should remove empty "safe" attributes', () => {
        return init(
            '<div ID="" class="" style title="" lang="en" dir="" alt=""></div>',
            '<div lang="en" alt=""></div>', // alt is not a safe to remove attribute
            {removeEmptyAttributes: true}
        );
    });
});
