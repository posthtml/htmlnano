import eslintPluginImport from 'eslint-plugin-import';
import * as eslintPluginPathImportExtension from 'eslint-plugin-path-import-extension';
import babelEslintParser from '@babel/eslint-parser';

export default [
    {
        files: ['*.mjs', 'lib/**/*.mjs', 'test/**/*.mjs'],
        ignores: [
            'lib/modules/example.mjs',
            'test.mjs',
            '**/*.cjs'
        ],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            parser: babelEslintParser,
            parserOptions: {
                requireConfigFile: false
            },
            globals: {
                node: true,
                browser: false,
                mocha: true
            }
        },
        plugins: {
            'import': eslintPluginImport,
            'path-import-extension': eslintPluginPathImportExtension
        },
        rules: {
            'indent': [2, 4, {"SwitchCase": 1}],
            'quotes': [2, "single"],
            'linebreak-style': [2, "unix"],
            'semi': [2, "always"],
            'camelcase': [2, {"properties": "always"}],
            'brace-style': [2, "1tbs", {"allowSingleLine": true}],
            'import/no-commonjs': "error",
            'import/no-dynamic-require': "error",
            'import/extensions': ["error", "always", { "mjs": "never" }],
            'path-import-extension/path-import-extension': ["error", { "extensions": [".mjs"] }]
        },
        settings: {
            'import/extensions': ['.js', '.cjs', '.mjs']
        }
    }
];
