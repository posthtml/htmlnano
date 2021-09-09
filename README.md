# htmlnano
[![npm version](https://badge.fury.io/js/htmlnano.svg)](http://badge.fury.io/js/htmlnano)
![CI](https://github.com/posthtml/htmlnano/actions/workflows/ci.yml/badge.svg)

Modular HTML minifier, built on top of the [PostHTML](https://github.com/posthtml/posthtml). Inspired by [cssnano](http://cssnano.co/).

To switch to the optional fork of uncss, apply `uncss-fork.patch`.

Reasons you may want to do this are: uncss uses outdated dependencies with security issues

Reasons you may want to avoid this are: long term support, stability

## [Benchmark](https://github.com/maltsev/html-minifiers-benchmark/blob/master/README.md)
[html-minifier-terser@5.1.1]: https://www.npmjs.com/package/html-minifier-terser
[htmlnano@1.0.0]: https://www.npmjs.com/package/htmlnano

| Website | Source (KB) | [html-minifier-terser@5.1.1] | [htmlnano@1.0.0] |
|---------|------------:|----------------:|-----------:|
| [stackoverflow.blog](https://stackoverflow.blog/) | 95 | 87 | 82 |
| [github.com](https://github.com/) | 210 | 183 | 171 |
| [en.wikipedia.org](https://en.wikipedia.org/wiki/Main_Page) | 78 | 72 | 72 |
| [npmjs.com](https://www.npmjs.com/features) | 41 | 38 | 36 |
| **Avg. minify rate** | 0% | **9%** | **13%** |


## Documentation
https://htmlnano.netlify.app
