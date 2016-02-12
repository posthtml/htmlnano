import { init } from '../htmlnano';

describe('removeRedundantAttributes', () => {
    const options = {removeRedundantAttributes: true};

    it('should remove method="get" from <form>', () => {
        return init(
            '<form method="get"></form>',
            '<form></form>',
            options
        );
    });

    it('should remove type="text" from <input>', () => {
        return init(
            '<input type="text">',
            '<input>',
            options
        );
    });

    it('should remove language="javascript" and type="text/javascript" from <script>', () => {
        return init(
            '<script language="javascript" type="text/javascript"></script>',
            '<script></script>',
            options
        );
    });

    it('should remove "charset" from <script> if it is an external script', () => {
        return init(
            '<script charset="UTF-8">alert();</script><script src="foo.js" charset="UTF-8"></script>',
            '<script>alert();</script><script src="foo.js" charset="UTF-8"></script>',
            options
        );
    });

    it('should remove type="text/css" from <style>', () => {
        return init(
            '<style type="text/css"></style>',
            '<style></style>',
            options
        );
    });

    it('should remove media="all" from <style> and <link>', () => {
        return init(
            '<style media="all"></style><link media="all">',
            '<style></style><link>',
            options
        );
    });
});
