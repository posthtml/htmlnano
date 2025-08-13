# htmlnano
[![npm version](https://badge.fury.io/js/htmlnano.svg)](http://badge.fury.io/js/htmlnano)
![CI](https://github.com/posthtml/htmlnano/actions/workflows/ci.yml/badge.svg)

Modular HTML minifier, built on top of the [PostHTML](https://github.com/posthtml/posthtml). Inspired by [cssnano](https://github.com/cssnano/cssnano).

## Benchmarks

[html-minifier-terser]: https://www.npmjs.com/package/html-minifier-terser/v/7.2.0
[html-minifier-next]: https://www.npmjs.com/package/html-minifier-next/v/1.1.5
[htmlnano]: https://www.npmjs.com/package/htmlnano/v/2.1.2

| Website                                                     | Source (KB) | [html-minifier-terser] | [html-minifier-next] | [htmlnano] |
| ----------------------------------------------------------- | ----------: | ---------------------: | -------------------: | ---------: |
| [stackoverflow.blog](https://stackoverflow.blog/)           |         342 |                   1.7% |                 1.7% |       4.1% |
| [github.com](https://github.com/)                           |         541 |                   3.7% |                 3.7% |      18.1% |
| [en.wikipedia.org](https://en.wikipedia.org/wiki/Main_Page) |         218 |                   4.6% |                 4.6% |       5.0% |
| [npmjs.com](https://www.npmjs.com/package/eslint)           |         459 |                   0.5% |                 0.5% |       0.9% |
| [tc39.es](https://tc39.es/ecma262/)                         |        7198 |                   8.6% |                 8.6% |       8.7% |
| [reddit.com](https://reddit.com/)                           |         539 |                   6.1% |                 6.1% |       6.9% |
| [apple.com](https://www.apple.com/)                         |         190 |                   7.6% |                 7.6% |      12.3% |
| [w3.org](https://www.w3.org/)                               |          48 |                  19.0% |                19.0% |      23.2% |
| [weather.com](https://weather.com)                          |        1823 |                   0.2% |                 0.2% |      13.1% |
| **Avg. minify rate**                                        |          0% |               **5.8%** |             **5.8%** |  **10.3%** |

Latest benchmarks: https://github.com/maltsev/html-minifiers-benchmark (updated daily).

## Documentation
https://htmlnano.netlify.app
