// this file has trailing whitespaces that should be kept

import { init } from '../htmlnano.mjs';

describe('removeOptionalTags', () => {
    const options = {
        removeOptionalTags: true
    };

    it('shouldn\'t omit optional tag if has attributes', () => {
        const input = `
        <html lang="en">
            <p>Welcome to this example.</p>
        </html>`;

        return init(input, input, options);
    });

    it('document example', () => {
        const input = '<html><head><title>Title</title></head><body><p>Hi</p></body></html>';
        const expected = '<title>Title</title><p>Hi</p>';

        return init(input, expected, options);
    });

    context('omit optional <html>', () => {
        it('default', () => {
            const input = `
            <html>
                <p>Welcome to this example.</p>
            </html>
            `;

            const expected = `
            
                <p>Welcome to this example.</p>
            
            `;

            return init(input, expected, options);
        });

        it('first thing inside <html> is a comment', () => {
            const input = `
            <html>
                <!-- where is this comment in the DOM? -->
            </html>`;

            return init(input, input, options);
        });

        it('<html> is not immediately followed by a comment', () => {
            const input = `
            <html>
                <p>Welcome to this example.</p>
            </html><!-- where is this comment in the DOM? -->`;

            return init(input, input, options);
        });
    });

    context('omit optional <head>', () => {
        it('<head> has elements', () => {
            const input = '<head><title>Title</title>';
            const expected = '<title>Title</title>';

            return init(input, expected, options);
        });

        it('<head> surrouned by whitespaces', () => {
            const input = `
            <!DOCTYPE HTML>
            <html>
                <!-- prevent <html> being removed -->
                <head>
                    <title>Hello</title>
                </head>
            </html>`;

            return init(input, input, options);
        });

        it('empty <head>', () => {
            const input = `
            <!DOCTYPE HTML>
            <html>
                <!-- prevent <html> being removed -->
                <head>
    
                </head></html>`;

            const expected = `
            <!DOCTYPE HTML>
            <html>
                <!-- prevent <html> being removed -->
                
    
                </html>`;

            return init(input, expected, options);
        });

        it('the first node inside <head> element is text', () => {
            const input = `
            <!DOCTYPE HTML>
            <html><!-- prevent <html> being removed --><head>Example</head></html>`;

            return init(input, input, options);
        });

        it('<head> is followed by whitespaces', () => {
            const input = `
            <!DOCTYPE HTML>
            <html><!-- prevent <html> being removed --><head></head>
            </html>`;

            return init(input, input, options);
        });

        it('<head> is followed by comment', () => {
            const input = `
            <!DOCTYPE HTML>
            <html><!-- prevent <html> being removed --><head></head><!-- prevent <html> being removed -->
            </html>`;

            return init(input, input, options);
        });
    });

    context('omit optional <body>', () => {
        it('default', () => {
            const input = `
            <body>
                <p>htmlnano</p>
            </body>
            `;

            // There is whitespaces after <body> and before </body>, thus <body> can't be ommited
            return init(input, input, options);
        });

        it('no white spaces nearby', () => {
            const input = '<body><p>htmlnano</p></body>';
            const expected = '<p>htmlnano</p>';

            return init(input, expected, options);
        });

        it('empty <body>', () => {
            const input = '<body></body>';
            const expected = '';

            return init(input, expected, options);
        });
    });

    it('html spec example 1', () => {
        const input = `
<!DOCTYPE HTML>
<html>
    <head>
        <title>Hello</title>
    </head>
    <body>
        <p>Welcome to this example.</p>
    </body>
</html>`;
        // </body> just can't be reomved simply because posthtml can't do this.
        // See https://github.com/posthtml/htmlnano/issues/99
        const expected = `
<!DOCTYPE HTML>

    <head>
        <title>Hello</title>
    </head>
    <body>
        <p>Welcome to this example.</p>
    </body>
`;

        return init(input, expected, options);
    });

    it('html spec example 2', () => {
        const input = '<!DOCTYPE HTML><html><head><title>Hello</title></head><body><p>Welcome to this example.</p></body></html>';
        const expected = '<!DOCTYPE HTML><title>Hello</title><p>Welcome to this example.</p>';

        return init(input, expected, options);
    });

    context('omit optional <colgroup>', () => {
        it('default', () => {
            const input = '<colgroup><col><col><col></colgroup>';
            const expected = '<col><col><col>';

            return init(input, expected, options);
        });

        it('empty <colgroup>', () => {
            const input = '<colgroup></colgroup>';

            return init(input, input, options);
        });

        it('first child node is not <col>', () => {
            const input = '<colgroup><div></div><col><col></colgroup>';

            return init(input, input, options);
        });

        it('<colgroup> followed by comment', () => {
            const input = '<colgroup><div></div><col><col></colgroup><!-- comment -->';

            return init(input, input, options);
        });

        it('<colgroup> followed by space', () => {
            const input = '<colgroup><div></div><col><col></colgroup> ';

            return init(input, input, options);
        });
    });

    context('omit optional <tbody>', () => {
        it('omit <tbody>', () => {
            const input = '<table><tbody><tr></tr></tbody></table>';
            const expected = '<table><tr></tr></table>';

            return init(input, expected, options);
        });

        it('<tbody> followed by another <tbody>', () => {
            const input = '<table><tbody><tr></tr></tbody><tbody><tr></tr></tbody></table>';

            return init(input, input, options);
        });

        it('<tbody> followed by <tfoot>', () => {
            const input = '<table><tbody><tr></tr></tbody><tfoot></tfoot></table>';

            return init(input, input, options);
        });

        it('empty <tbody>', () => {
            const input = '<tbody></tbody>';

            return init(input, input, options);
        });
    });

    it('html spec example 3', () => {
        const input = `
<table>
 <caption>37547 TEE Electric Powered Rail Car Train Functions (Abbreviated)</caption>
 <colgroup><col><col><col></colgroup>
 <thead>
  <tr>
   <th>Function</th>
   <th>Control Unit</th>
   <th>Central Station</th>
  </tr>
 </thead>
 <tbody>
  <tr>
   <td>Headlights</td>
   <td>✔</td>
   <td>✔</td>
  </tr>
  <tr>
   <td>Interior Lights</td>
   <td>✔</td>
   <td>✔</td>
  </tr>
  <tr>
   <td>Electric locomotive operating sounds</td>
   <td>✔</td>
   <td>✔</td>
  </tr>
  <tr>
   <td>Engineer's cab lighting</td>
   <td></td>
   <td>✔</td>
  </tr>
  <tr>
   <td>Station Announcements - Swiss</td>
   <td></td>
   <td>✔</td>
  </tr>
 </tbody>
</table>`;
        // </caption>, </thead>, </th>, </td> and </tr> just can't be reomved simply because posthtml can't do this.
        // See https://github.com/posthtml/htmlnano/issues/99
        const expected = `
<table>
 <caption>37547 TEE Electric Powered Rail Car Train Functions (Abbreviated)</caption>
 <colgroup><col><col><col></colgroup>
 <thead>
  <tr>
   <th>Function</th>
   <th>Control Unit</th>
   <th>Central Station</th>
  </tr>
 </thead>
 <tbody>
  <tr>
   <td>Headlights</td>
   <td>✔</td>
   <td>✔</td>
  </tr>
  <tr>
   <td>Interior Lights</td>
   <td>✔</td>
   <td>✔</td>
  </tr>
  <tr>
   <td>Electric locomotive operating sounds</td>
   <td>✔</td>
   <td>✔</td>
  </tr>
  <tr>
   <td>Engineer's cab lighting</td>
   <td></td>
   <td>✔</td>
  </tr>
  <tr>
   <td>Station Announcements - Swiss</td>
   <td></td>
   <td>✔</td>
  </tr>
 </tbody>
</table>`;

        return init(input, expected, options);
    });
});
