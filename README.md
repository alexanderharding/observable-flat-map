# @xan/observable-flat-map

A utility that projects each `source` value to an
[`Observable`](https://jsr.io/@xan/observable/doc/~/Observable) which is merged in the output
[`Observable`](https://jsr.io/@xan/observable/doc/~/Observable), in a serialized fashion waiting for
each one to [`return`](https://jsr.io/@xan/observer/doc/~/Observer.return) before merging the next.

## Build

Automated by [JSR](https://jsr.io/).

## Publishing

Automated by `.github\workflows\publish.yml`.

## Running unit tests

Run `deno task test` or `deno task test:ci` to execute the unit tests via
[Deno](https://deno.land/).

## Example

```ts
import { flatMap } from "@xan/observable-flat-map";
import { of } from "@xan/observable-of";
import { pipe } from "@xan/pipe";

const source = of("a", "b", "c");
const controller = new AbortController();
const observableLookup = {
  a: of(1, 2, 3),
  b: of(4, 5, 6),
  c: of(7, 8, 9),
} as const;

pipe(
  source,
  flatMap((value) => observableLookup[value]),
).subscribe({
  signal: controller.signal,
  next: (value) => console.log(value),
  return: () => console.log("return"),
  throw: (value) => console.log("throw", value),
});

// Console output:
// 1
// 2
// 3
// 4
// 5
// 6
// 7
// 8
// 9
// return
```

# Glossary And Semantics

- [@xan/observer](https://jsr.io/@xan/observer#glossary-and-semantics)
- [@xan/observable](https://jsr.io/@xan/observable#glossary-and-semantics)
