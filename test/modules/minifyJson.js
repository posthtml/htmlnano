import { init } from '../htmlnano';


describe('minifyJson', () => {
    const options = {minifyJson: true};

    it('should minify JSON inside <script> tags with type="application/json"', () => {
        return init(
            `<script type="application/json">
                {
                    "test": 5
                }
            </script>`,
            '<script type="application/json">{"test":5}</script>',
            options
        );
    });

    it('should skip <script> tags with type != "application/json"', () => {
        return init(
            '<script>{"test": 5}</script>',
            '<script>{"test": 5}</script>',
            options
        );
    });

    it('should skip <script> tags with invalid JSON', () => {
        return init(
            '<script type="application/json">{test: 5}</script>',
            '<script type="application/json">{test: 5}</script>',
            options
        );
    });
});
