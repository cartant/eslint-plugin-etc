# Use interfaces instead of type aliases (`prefer-interface`)

This rule effects failures for type alias declarations that can be declared as interfaces.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Honestly, my take is that it should really just be interfaces for anything that they can model. There is no benefit to type aliases when there are so many issues around display/perf.</p>&mdash; Daniel Rosenwasser (@drosenwasser) <a href="https://twitter.com/drosenwasser/status/1319205169918144513?ref_src=twsrc%5Etfw">October 22, 2020</a></blockquote>

## Rule details

Examples of **incorrect** code for this rule:

```ts
type Person = {
  age: number;
  name: string;
};
```

Examples of **correct** code for this rule:

```ts
interface Person {
  age: number;
  name: string;
}
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

This rule has no options.

## Further reading

- The [Twitter thread](https://twitter.com/robpalmer2/status/1319188885197422594) from which the above quote was taken.
- [Prefer Interfaces](https://ncjamieson.com/prefer-interfaces)