# PostHTML Minifier
Modular HTML minifier.


## Usage
Just add `posthtml-minifier` as the last plugin:
```js
var posthtml = require('posthtml');

posthtml([
    /* other PostHTML plugins */

    require('posthtml-minifier')({
        removeComments: false // Disable the module "removeComments"
    })
]).process(html).then(function (result) {
    // result.html is minified
});
```


## Contribute

Since the minifier is modular, it's very easy to add new modules:

1. Create a file inside `lib/minifiers/` with a function that does some minification.
2. Create a file inside `test/minifiers/` with some unit-tests.
3. Describe your module in the section "[Modules](https://github.com/maltsev/posthtml-minifier/blob/master/README.md#modules)".
4. Send me a pull request.
