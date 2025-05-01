import { init } from '../htmlnano.mjs';
import safePreset from '../../dist/presets/safe.mjs';


describe('minifyJson', () => {
    const options = {
        minifyJson: safePreset.minifyJson,
    };

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

    it('should skip JSON inside <script> tags with SRI', () => {
        const fixtures = `<script type="application/json" integrity="example">
                {
                    "test": 5
                }
             </script>
             <script type="application/ld+json" integrity="example">
                {
                    "test": 6
                }
             </script>`;

        return init(
            fixtures,
            fixtures,
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
