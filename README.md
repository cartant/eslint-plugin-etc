# eslint-plugin-etc

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

# Rules

The package includes the following rules:

| Rule | Description | Recommended |
| --- | --- | --- |
| [`ban-imports`](https://github.com/cartant/eslint-plugin-etc/blob/main/source/rules/ban-imports.ts) | Forbids using the configured import locations. | TBD |
| [`deprecation`](https://github.com/cartant/eslint-plugin-etc/blob/main/source/rules/deprecation.ts) | Forbids the use of deprecated APIs. | TBD |
| [`no-assign-mutated-array`](https://github.com/cartant/eslint-plugin-etc/blob/main/source/rules/no-assign-mutated-array.ts) | Forbids the assignment of returned, mutated arrays. | TBD |
| [`no-const-enum`](https://github.com/cartant/eslint-plugin-etc/blob/main/source/rules/no-const-enum.ts) | Forbids the use of `const enum`. Constant enums are [not compatible with isolated modules](https://ncjamieson.com/dont-export-const-enums/). | TBD |
| [`no-enum`](https://github.com/cartant/eslint-plugin-etc/blob/main/source/rules/no-enum.ts) | Forbids the use of `enum`. | TBD |
| [`no-implicit-any-catch`](https://github.com/cartant/eslint-plugin-etc/blob/main/source/rules/no-implicit-any-catch.ts) | Like the [`no-implicit-any-catch` rule](https://github.com/typescript-eslint/typescript-eslint/pull/2202) in `@typescript-eslint/eslint-plugin`, but for `Promise` rejections instead of `catch` clauses. | TBD |
| [`no-misused-generics`](https://github.com/cartant/eslint-plugin-etc/blob/main/source/rules/no-misused-generics.ts) | Forbids type parameters without inference sites and type parameters that don't add type safety to declarations. This is an ESLint port of [Wotan's `no-misused-generics` rule](https://github.com/fimbullinter/wotan/blob/11368a193ba90a9e79b9f6ab530be1b434b122de/packages/mimir/docs/no-misused-generics.md). See also ["The Golden Rule of Generics"](https://effectivetypescript.com/2020/08/12/generics-golden-rule/). | TBD |
| [`no-t`](https://github.com/cartant/eslint-plugin-etc/blob/main/source/rules/no-t.ts) | Forbids single-character type parameters. | TBD |
| [`throw-error`](https://github.com/cartant/eslint-plugin-etc/blob/main/source/rules/throw-error.ts) | Forbids throwing - or rejecting with - non-`Error` values. | TBD |