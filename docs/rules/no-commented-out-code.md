# Avoid commented-out code (`no-commented-out-code`)

This rule forbids commented-out code by effecting failures for comment blocks can be parsed without error.

## Rule details

Examples of **incorrect** code for this rule:

```ts
// const answer = 54;
const answer = 42;
```

Examples of **correct** code for this rule:

```ts
// This comment includes code is not code.
const answer = 42;
```

```ts
// This comment includes code as an example:
// const answer = 54;
// So it won't effect a failure.
const answer = 42;
```

## Options

This rule has no options.
