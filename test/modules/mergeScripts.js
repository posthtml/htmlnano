import { init } from '../htmlnano';


describe('mergeScripts', () => {
    const options = {mergeScripts: true};

    it('should merge <script> with the same attributes', () => {
        return init(
            `<script>var foo = 1;</script>
            <script class="test">foo = 2;</script>
            <script type="text/javascript">foo = 3;</script>
            <script defer>foo = 4;</script>
            <script>foo = 5;</script>
            <script defer="defer">foo = 6;</script>
            <script class="test" type="text/javascript">foo = 7;</script>`,

            '\n            \n            \n            \n            ' +
            `<script>var foo = 1;foo = 3;foo = 5;</script>
            <script defer="defer">foo = 4;foo = 6;</script>
            <script class="test" type="text/javascript">foo = 2;foo = 7;</script>`,

            options
        );
    });

    it('should add trailing ; when it\'s missing in oneline <script>', () => {
        return init(
            '<script>document.write("Hello, ")</script><script>document.write("World!")</script>',
            '<script>document.write("Hello, ");document.write("World!")</script>',
            options
        );
    });

    it('should add trailing ; when it\'s missing in multiline <script>', () => {
        return init(
            `<script>

                // Some comment
                var a = 5;
                var b = a + 6

            </script><script>

                var c = 10

            </script>`,
            `<script>// Some comment
                var a = 5;
                var b = a + 6;

                var c = 10

            </script>`,
            options
        );
    });
});
