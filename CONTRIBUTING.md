# Contributing

## Style

All code contributed must follow these style guidelines.

* Must be indented with 2 spaces
* `{` characters as part of a function declaration or loop must be on the same line as the declaration, e.g.
```js
let x = function () {
  //...
}
```
* Must use double quotes (`"`) for strings
* Spaces must be used after keywords (i.e. if, else, while) but **not** after function names. e.g.

```js
function something() { //no space between "something" and "("
  if (x === 5) { //space between "if" and "("
    //...
  }
}
```
* `===` must be used instead of `==` to check equality.
   * Exception: checking if an object is either `null` or `undefined`. For example, `x === null || x === undefined` can be substituted with `x == null`.

## JavaScript convention
* Use `let` or `const` instead of `var` whenever possible.
* Use `for`-`of` loops when iterating over an array if the index is not needed.

## JSDoc

[JSDoc](http://usejsdoc.org/) is used to document code. Properly documenting functions allows IDEs such as WebStorm to verify arguments are of the correct type before runtime.

Not every function must be documented, but any sufficiently complex function should at least use `@param` and `@returns` to denote the types of the parameters and return value.
