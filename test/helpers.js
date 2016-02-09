import expect from 'expect';
import { isComment, isConditionalComment } from '../lib/helpers';

describe('[helpers]', () => {
    context('isComment()', () => {
        it('should detect HTML comments', () => {
            expect(isComment(' <!-- comment --> ')).toBe(true);
            expect(isComment(' <!--[if IE 6]><p>You are using IE 6<![endif]-->')).toBe(true);
            expect(isComment('Some text')).toBe(false);
        });
    });

    context('isConditionalComment()', () => {
        it('should detect conditional HTML comments', () => {
            expect(isConditionalComment(' <!--[if IE 6]><p>You are using IE 6<![endif]-->')).toBe(true);
            expect(isConditionalComment(' <!-- comment --> ')).toBe(false);
            expect(isConditionalComment('Some text')).toBe(false);
        });
    });
});
