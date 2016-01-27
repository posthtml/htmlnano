import { init } from '../htmlnano';

describe('minifyCss', () => {
    const options = {minifyCss: {}};
    const html = `<div><style>
        h1 {
            margin: 10px 10px 10px 10px;
            color: #ff0000;
            -moz-border-radius: 10px;
            border-radius: 10px;
        }
    </style></div>`;


    it('should minify CSS inside <style>', () => {
        return init(
            html,
            '<div><style>h1{margin:10px;color:red;border-radius:10px}</style></div>',
            options
        );
    });


    it('should minify CSS inside style attribute', () => {
        return init(
            '<div style="color: #ff0000; margin: 10px 10px 10px 10px"></div>',
            '<div style="color:red;margin:10px"></div>',
            options
        );
    });


    it('should do nothing if style attribute is empty', () => {
        return init(
            '<div style=""></div>',
            '<div style=""></div>',
            options
        );
    });


    it('should pass options to cssnano', () => {
        return init(
            html,
            '<div><style>h1{margin:10px;color:red;-moz-border-radius:10px;border-radius:10px}</style></div>',
            {minifyCss: {autoprefixer: false}}
        );
    });
});
