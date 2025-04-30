import { init } from '../htmlnano';
import maxPreset from '../../lib/presets/max';


describe('removeUnusedCss (uncss)', function () {
    this.timeout(3000);

    const options = {
        removeUnusedCss: maxPreset.removeUnusedCss,
    };
    const html = `<div><style>
        div.b {
            padding: 10px;
            border-radius: 10px;
        }
        .b {
            color: red;
        }
        .c {
            color: #123;
        }
    </style></div><p class="b">hello</p><style>.d{margin:auto}</style>`;


    it('should remove unused CSS inside <style>', () => {
        return init(
            html,
            `<div><style>
        .b {
            color: red;
        }
    </style></div><p class="b">hello</p>`,
            options
        );
    });


    it('should pass options to uncss', () => {
        return init(
            html,
            `<div><style>
        .b {
            color: red;
        }
        .c {
            color: #123;
        }
    </style></div><p class="b">hello</p>`,
            {
                removeUnusedCss: {
                    ignore: ['.c']
                }
            }
        );
    });


    it('should work with minifyCss', () => {
        return init(
            html,
            '<div><style>.b{color:red}</style></div><p class="b">hello</p>',
            {
                removeUnusedCss: maxPreset.removeUnusedCss,
                minifyCss: {},
            }
        );
    });
});

describe('removeUnusedCss (purgeCSS)', function () {
    const options = {
        removeUnusedCss: {
            tool: 'purgeCSS'
        },
    };
    const html = `<div><style>
        div.r {
            padding: 10px;
            border-radius: 10px;
        }
        .b {
            color: red;
        }
        .c {
            color: #123;
        }
    </style></div><p class="b">hello</p><style>.d{margin:auto}</style>`;


    it('should remove unused CSS inside <style>', () => {
        return init(
            html,
            `<div><style>
        .b {
            color: red;
        }
    </style></div><p class="b">hello</p>`,
            options
        );
    });


    it('should pass options to purgeCSS', () => {
        return init(
            html,
            `<div><style>
        .b {
            color: red;
        }
        .c {
            color: #123;
        }
    </style></div><p class="b">hello</p>`,
            {
                removeUnusedCss: {
                    tool: 'purgeCSS',
                    safelist: ['c']
                }
            }
        );
    });


    it('should work with minifyCss', () => {
        return init(
            html,
            '<div><style>.b{color:red}</style></div><p class="b">hello</p>',
            {
                removeUnusedCss: maxPreset.removeUnusedCss,
                minifyCss: {},
            }
        );
    });
});
