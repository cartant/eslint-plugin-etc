# Use interfaces instead of type aliases (`prefer-interface`)

This rule effects failures for type alias declarations that can be declared as interfaces.

> Honestly, my take is that it should really just be interfaces for anything that they can model. There is no benefit to type aliases when there are so many issues around display/perf.
>
> We tried for a long time to paper over the distinction because of people's personal choices, but ultimately unless we actually simplify the types internally (could happen) they're not really the same, and interfaces behave better.
>
> &mdash; Daniel Rosenwasser [October 22, 2020](https://twitter.com/drosenwasser/status/1319205169918144513)

## Rule details

Examples of **incorrect** code for this rule:

```ts
type Person = {
  age: number;
  name: string;
};
```

```ts
type Comparator<T> = (left: T, right: T) => number;
```

Examples of **correct** code for this rule:

```ts
interface Person {
  age: number;
  name: string;
}
```

```ts
interface Comparator<T> { (left: T, right: T): number; }
```

```ts
type Worker = Person | Robot;
```

```ts
type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>
};
```

## Options

This rule accepts a single option which is an object with an `allowLocal` property that determines whether local - i.e. non-exported - type aliases that could be declared as interfaces are allowed. By default, they are not.

```json
{
  "etc/prefer-interface": [
    "error",
    { "allowLocal": true }
  ]
}
```

## Further reading

- The [Twitter thread](https://twitter.com/robpalmer2/status/1319188885197422594) from which the above quote was taken.
- [Prefer Interfaces](https://ncjamieson.com/prefer-interfaces)