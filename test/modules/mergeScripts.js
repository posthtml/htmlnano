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
            `<script>var foo = 1; foo = 3; foo = 5;</script>
            <script defer="defer">foo = 4; foo = 6;</script>
            <script class="test" type="text/javascript">foo = 2; foo = 7;</script>`,

            options
        );
    });
});