import { init } from '../htmlnano';
import maxPreset from '../../lib/presets/max';


describe('removeRedundantAttributes', () => {
    const options = {
        removeRedundantAttributes: maxPreset.removeRedundantAttributes,
    };

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

    it('should remove type="submit" from <button>', () => {
        return init(
            '<button type="submit">Button</button>',
            '<button>Button</button>',
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

    it('should remove redundant type from <script>', () => {
        return init(
            '<script type="text/jscript"></script><script type="application/javascript"></script><script type="application/ecmascript"></script>',
            '<script></script><script></script><script></script>',
            options
        );
    });

    it('shouldn\'t remove type=module from <script>', () => {
        return init(
            '<script type="module"></script>',
            '<script type="module"></script>',
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

    it('should remove type="text/css" from link[rel=stylesheet]', () => {
        return init(
            '<link rel="stylesheet" type="text/css" href="style.css">',
            '<link rel="stylesheet" href="style.css">',
            options
        );
    });

    it('shouldn\'t remove new type from link[rel=stylesheet]', () => {
        return init(
            '<link rel="stylesheet" type="text/example" href="style.css">',
            '<link rel="stylesheet" type="text/example" href="style.css">',
            options
        );
    });

    it('should remove loading="eager" from <img> & <iframe>', () => {
        return init(
            '<img src="example.com" loading="eager"><iframe src="example.com" loading="eager"></iframe>',
            '<img src="example.com"><iframe src="example.com"></iframe>',
            options
        );
    });

    it('shouldn\'t remove loading="lazy" from <img> & <iframe>', () => {
        return init(
            '<img src="example.com" loading="lazy"><iframe src="example.com" loading="lazy"></iframe>',
            '<img src="example.com" loading="lazy"><iframe src="example.com" loading="lazy"></iframe>',
            options
        );
    });

    it('should remove preload="auto" from <audio> & <video>', () => {
        return init(
            '<audio src="example.com" preload="auto"></audio><video src="example.com" preload="auto"></video>',
            '<audio src="example.com" preload=""></audio><video src="example.com" preload=""></video>',
            options
        );
    });

    it('should remove preload="metadata" from <audio> & <video>', () => {
        return init(
            '<audio src="example.com" preload="metadata"></audio><video src="example.com" preload="metadata"></video>',
            '<audio src="example.com" preload="metadata"></audio><video src="example.com" preload="metadata"></video>',
            options
        );
    });
});
