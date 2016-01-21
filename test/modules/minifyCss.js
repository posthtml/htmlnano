import { init } from '../htmlnano';

describe('minifyCss', () => {
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
            {minifyCss: {}}
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
