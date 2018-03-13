import expect from 'expect';
import { init } from '../htmlnano';

describe('custom', () => {
    it('should apply a custom minifier module', () => {
        return init(
            '<div><span>hello</span></div>',
            '<div>hello</div>',
            {custom: getRemoveTagFunction('span')}
        );
    });

    it('should apply multiple custom minifier modules', () => {
        return init(
            '<div><span>hello</span></div>',
            '<div>hello</div>',
            {custom: [getRemoveTagFunction('span'), getRemoveTagFunction('span')]}
        );
    });
});


function getRemoveTagFunction(tag) {
    return (tree, options) => {
        expect(options.custom).toBeTruthy();

        tree.match({ tag }, node => {
            node.tag = false;
            return node;
        });

        return tree;
    };
}
