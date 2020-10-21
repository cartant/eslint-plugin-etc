# eslint-plugin-etc

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/cartant/eslint-plugin-etc/blob/master/LICENSE)
[![NPM version](https://img.shields.io/npm/v/eslint-plugin-etc.svg)](https://www.npmjs.com/package/eslint-plugin-etc)
[![Downloads](http://img.shields.io/npm/dm/eslint-plugin-etc.svg)](https://npmjs.org/package/eslint-plugin-etc)
[![Build status](https://img.shields.io/circleci/build/github/cartant/eslint-plugin-etc?token=8ebc6af0847545d4c2346f5ffaedee508b55ce38)](https://app.circleci.com/pipelines/github/cartant)
[![dependency status](https://img.shields.io/david/cartant/eslint-plugin-etc.svg)](https://david-dm.org/cartant/eslint-plugin-etc)
[![devDependency Status](https://img.shields.io/david/dev/cartant/eslint-plugin-etc.svg)](https://david-dm.org/cartant/eslint-plugin-etc#info=devDependencies)
[![peerDependency Status](https://img.shields.io/david/peer/cartant/eslint-plugin-etc.svg)](https://david-dm.org/cartant/eslint-plugin-etc#info=peerDependencies)

This repo is a WIP.

Eventually, it will contain ESLint versions of the rules in the [`tslint-etc`](https://github.com/cartant/tslint-etc) package.

# Install

Install the ESLint TypeScript parser using npm:

```
npm install @typescript-eslint/parser --save-dev
```

Install the package using npm:

```
npm install eslint-plugin-etc --save-dev
```

Configure the `parser` and the `parserOptions` for ESLint. Here, I use a `.eslintrc.js` file for the configuration:

```js
const { join } = require("path");
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2019,
    project: join(__dirname, "./tsconfig.json"),
    sourceType: "module"
  },
  plugins: ["etc"],
  extends: [],
  rules: {
    "etc/no-t": "error"
  }
};
```

Or, using the `recommended` configuration:

```js
const { join } = require("path");
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2019,
    project: join(__dirname, "./tsconfig.json"),
    sourceType: "module"
  },
  extends: ["plugin:etc/recommended"],
};
```

# Rules

The package includes the following rules:

| Rule | Description | Recommended |
| --- | --- | --- |
| [`no-assign-mutated-array`](https://github.com/cartant/eslint-plugin-etc/blob/main/docs/rules/no-assign-mutated-array.ts) | Forbids the assignment of returned, mutated arrays. | Yes |
| [`no-const-enum`](https://github.com/cartant/eslint-plugin-etc/blob/main/docs/rules/no-const-enum.ts) | Forbids the use of `const enum`. Constant enums are [not compatible with isolated modules](https://ncjamieson.com/dont-export-const-enums/). | No |
| [`no-deprecated`](https://github.com/cartant/eslint-plugin-etc/blob/main/docs/rules/no-deprecated.ts) | Forbids the use of deprecated APIs. | Yes |
| [`no-enum`](https://github.com/cartant/eslint-plugin-etc/blob/main/docs/rules/no-enum.ts) | Forbids the use of `enum`. | No |
| [`no-implicit-any-catch`](https://github.com/cartant/eslint-plugin-etc/blob/main/docs/rules/no-implicit-any-catch.ts) | Like the [`no-implicit-any-catch` rule](https://github.com/typescript-eslint/typescript-eslint/pull/2202) in `@typescript-eslint/eslint-plugin`, but for `Promise` rejections instead of `catch` clauses. | Yes |
| [`no-internal`](https://github.com/cartant/eslint-plugin-etc/blob/main/docs/rules/no-internal.ts) | Forbids the use of internal APIs. | Yes |
| [`no-misused-generics`](https://github.com/cartant/eslint-plugin-etc/blob/main/docs/rules/no-misused-generics.ts) | Forbids type parameters without inference sites and type parameters that don't add type safety to declarations. This is an ESLint port of [Wotan's `no-misused-generics` rule](https://github.com/fimbullinter/wotan/blob/11368a193ba90a9e79b9f6ab530be1b434b122de/packages/mimir/docs/no-misused-generics.md). See also ["The Golden Rule of Generics"](https://effectivetypescript.com/2020/08/12/generics-golden-rule/). | Yes |
| [`no-t`](https://github.com/cartant/eslint-plugin-etc/blob/main/docs/rules/no-t.ts) | Forbids single-character type parameters. | No |
| [`throw-error`](https://github.com/cartant/eslint-plugin-etc/blob/main/docs/rules/throw-error.ts) | Forbids throwing - or rejecting with - non-`Error` values. | No |