import { init } from '../htmlnano';
import maxPreset from '../../lib/presets/max';


describe('removeUnusedCss (purgeCSS)', function () {
    const options = {
        removeUnusedCss: {
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
