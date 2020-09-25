<a name="0.0.3-beta.46"></a>
## [0.0.3-beta.46](https://github.com/cartant/eslint-plugin-etc/compare/v0.0.2-beta.45...v0.0.3-beta.46) (2020-09-25)

## Breaking Changes

* Removed the `no-unused-declarations` rule. Now that the official TypeScript ESLint plugin has a proper implementation of [`no-unused-vars`](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-vars.md), `no-unused-declaration` is pretty much redundant and I would prefer not to support it. If anyone needs to differentiate between vars and imports, the [`eslint-plugin-unused-imports`](https://github.com/sweepline/eslint-plugin-unused-imports) plugin includes `no-unused-vars-ts` and `no-unused-imports-t` rules - and the latter has a fixer.