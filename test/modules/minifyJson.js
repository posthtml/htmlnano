import { init } from '../htmlnano';


describe('minifyJson', () => {
    const options = {minifyJson: true};

    it('should minify JSON inside <script> tags with JSON mime type', () => {
        return init(
            `<script type="application/json">
                {
                    "test": 5
                }
             </script>
             <script type="application/ld+json">
                {
                    "test": 6
                }
             </script>`,

            `<script type="application/json">{"test":5}</script>
             <script type="application/ld+json">{"test":6}</script>`,
            options
        );
    });

    it('should skip <script> tags with non-JSON mime type', () => {
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
