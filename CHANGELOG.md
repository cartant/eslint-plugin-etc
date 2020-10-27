<a name="1.1.3"></a>
## [1.1.3](https://github.com/cartant/eslint-plugin-etc/compare/v1.1.2...v1.1.3) (2020-10-27)

## Fixes

* Include type parameters in `prefer-interface` fixer output for function types. ([8762605](https://github.com/cartant/eslint-plugin-etc/commit/8762605))

<a name="1.1.2"></a>
## [1.1.2](https://github.com/cartant/eslint-plugin-etc/compare/v1.1.1...v1.1.2) (2020-10-27)

## Fixes

* Include type parameters in `prefer-interface` fixer output. ([d90b938](https://github.com/cartant/eslint-plugin-etc/commit/d90b938))

<a name="1.1.1"></a>
## [1.1.1](https://github.com/cartant/eslint-plugin-etc/compare/v1.1.0...v1.1.1) (2020-10-27)

## Changes

* Specify Node 10 as the minimum `engines` in `package.json` and downlevel to ES2018.

<a name="1.1.0"></a>
## [1.1.0](https://github.com/cartant/eslint-plugin-etc/compare/v1.0.2...v1.1.0) (2020-10-26)

## Features

* Add the `prefer-interface` rule.  ([ccf6a02](https://github.com/cartant/eslint-plugin-etc/commit/ccf6a02))

<a name="1.0.2"></a>
## [1.0.2](https://github.com/cartant/eslint-plugin-etc/compare/v1.0.1...v1.0.2) (2020-10-23)

## Changes

* Specify `engines` in `package.json`.
* Downlevel the TypeScript output to ES2019.

<a name="1.0.1"></a>
## [1.0.1](https://github.com/cartant/eslint-plugin-etc/compare/v1.0.0...v1.0.1) (2020-10-22)

## Changes

* Update `README.md`.

<a name="1.0.0"></a>
## [1.0.0](https://github.com/cartant/eslint-plugin-etc/compare/v0.0.3-beta.48...v1.0.0) (2020-10-22)

## Breaking Changes

* Remove deprecated rules.

## Changes

* Add rule docs.

<a name="0.0.3-beta.48"></a>
## [0.0.3-beta.48](https://github.com/cartant/eslint-plugin-etc/compare/v0.0.2-beta.46...v0.0.3-beta.48) (2020-10-01)

## Changes

* A `no-internal` rule has been added.
* The `deprecation` rule has been deprecated and renamed to `no-deprecated`.
* The `ban-imports` rule has been deprecated in favour of the built-in ESLint rule `no-restricted-imports`.
* The deprecated rules will be removed when the beta ends.

<a name="0.0.3-beta.46"></a>
## [0.0.3-beta.46](https://github.com/cartant/eslint-plugin-etc/compare/v0.0.2-beta.45...v0.0.3-beta.46) (2020-09-25)

## Breaking Changes

* Removed the `no-unused-declarations` rule. Now that the official TypeScript ESLint plugin has a proper implementation of [`no-unused-vars`](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-vars.md), `no-unused-declaration` is pretty much redundant and I would prefer not to support it. If anyone needs to differentiate between vars and imports, the [`eslint-plugin-unused-imports`](https://github.com/sweepline/eslint-plugin-unused-imports) plugin includes `no-unused-vars-ts` and `no-unused-imports-ts` rules - and the latter has a fixer.
