# Use `for` loops instead of `forEach` calls (`no-foreach`)

TK

## Rule details

Examples of **incorrect** code for this rule:

```ts
const answers = [42, 54];
answers.forEach(answer => console.log(answer));
```

Examples of **correct** code for this rule:

```ts
const answers = [42, 54];
for (const answer of answers) {
  console.log(answer);
}
```

## Options

TK

```ts
import { of } from "rxjs";
of(42, 54).forEach(value => console.log(value));
```