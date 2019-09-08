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
[`ban-imports`](https://github.com/cartant/eslint-plugin-etc/blob/master/source/rules/ban-imports.ts) | Forbids using the configured import locations. | TBD |
[`deprecation`](https://github.com/cartant/eslint-plugin-etc/blob/master/source/rules/deprecation.ts) | Forbids the use of deprecated APIs. | TBD |
[`no-const-enum`](https://github.com/cartant/eslint-plugin-etc/blob/master/source/rules/no-const-enum.ts) | Forbids the use of `const enum`. | TBD |
[`no-enum`](https://github.com/cartant/eslint-plugin-etc/blob/master/source/rules/no-enum.ts) | Forbids the use of `enum`. | TBD |
[`no-t`](https://github.com/cartant/eslint-plugin-etc/blob/master/source/rules/no-t.ts) | Forbids single-character type parameters. | TBD |
[`throw-error`](https://github.com/cartant/eslint-plugin-etc/blob/master/source/rules/throw-error.ts) | Forbids throwing - or rejecting with - non-`Error` values. | TBD |