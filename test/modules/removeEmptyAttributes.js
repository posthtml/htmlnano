import { init } from '../htmlnano';

describe('removeEmptyAttributes', () => {
    const options = {removeEmptyAttributes: true};

    it('should remove empty attributes', () => {
        return init(
            '<div ID="" class="" style title="" lang="en" dir="" alt=""></div>',
            '<div lang="en" alt=""></div>', // alt is not a safe to remove attribute
            options
        );
    });


    it('should remove attributes that contains only white spaces', () => {
        return init(
            '<div id="   " title="	"></div>',
            '<div></div>',
            options
        );
    });
});
