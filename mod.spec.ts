import { assertEquals } from "@std/assert";
import { Subject } from "@xan/subject";
import { Observer } from "@xan/observer";
import { pipe } from "@xan/pipe";
import { flatMap } from "./mod.ts";
import { map } from "@xan/observable-map";

Deno.test("flatMap should flatten many inner", () => {
  // Arrange
  const a = new Subject<void>();
  const b = new Subject<void>();
  const c = new Subject<void>();
  const d = new Subject<void>();
  const notifications: Array<["N", string] | ["R"] | ["T", unknown]> = [];
  const observableLookup = {
    a: pipe(
      a,
      map(() => "a"),
    ),
    b: pipe(
      b,
      map(() => "b"),
    ),
    c: pipe(
      c,
      map(() => "c"),
    ),
    d: pipe(
      d,
      map(() => "d"),
    ),
  } as const;
  const source = new Subject<keyof typeof observableLookup>();
  const observable = pipe(
    source,
    flatMap((value) => observableLookup[value]),
  );

  // Act
  observable.subscribe(
    new Observer({
      next: (value) => notifications.push(["N", value]),
      return: () => notifications.push(["R"]),
      throw: (value) => notifications.push(["T", value]),
    }),
  );
  source.next("a");
  a.next();
  source.next("b");
  b.next();
  a.next();
  b.next();
  a.next();
  a.return();
  b.next();
  b.return();
  source.next("c");
  c.next();
  c.next();
  d.next();
  c.return();
  source.next("d");
  d.next();
  d.next();
  d.return();
  source.return();

  // Assert
  assertEquals(notifications, [
    ["N", "a"],
    ["N", "a"],
    ["N", "a"],
    ["N", "b"],
    ["N", "c"],
    ["N", "c"],
    ["N", "d"],
    ["N", "d"],
    ["R"],
  ]);
});

Deno.test("flatMap should flatten many inner, and inner throws", () => {
  // Arrange
  const error = new Error("error");
  const a = new Subject<void>();
  const b = new Subject<void>();
  const c = new Subject<void>();
  const d = new Subject<void>();
  const notifications: Array<["N", string] | ["R"] | ["T", unknown]> = [];
  const observableLookup = {
    a: pipe(
      a,
      map(() => "a"),
    ),
    b: pipe(
      b,
      map(() => "b"),
    ),
    c: pipe(
      c,
      map(() => "c"),
    ),
    d: pipe(
      d,
      map(() => "d"),
    ),
  } as const;
  const source = new Subject<keyof typeof observableLookup>();
  const observable = pipe(
    source,
    flatMap((value) => observableLookup[value]),
  );

  // Act
  observable.subscribe(
    new Observer({
      next: (value) => notifications.push(["N", value]),
      return: () => notifications.push(["R"]),
      throw: (value) => notifications.push(["T", value]),
    }),
  );
  source.next("a");
  a.next();
  source.next("b");
  b.next();
  a.next();
  b.next();
  a.next();
  a.return();
  b.next();
  b.return();
  source.next("c");
  c.next();
  c.next();
  d.next();
  c.throw(error);
  source.next("d");
  d.next();
  d.next();
  d.return();
  source.return();

  // Assert
  assertEquals(notifications, [
    ["N", "a"],
    ["N", "a"],
    ["N", "a"],
    ["N", "b"],
    ["N", "c"],
    ["N", "c"],
    ["T", error],
  ]);
});

Deno.test("flatMap should flatten many inner, and outer throws", () => {
  // Arrange
  const error = new Error("error");
  const a = new Subject<void>();
  const b = new Subject<void>();
  const c = new Subject<void>();
  const d = new Subject<void>();
  const notifications: Array<["N", string] | ["R"] | ["T", unknown]> = [];
  const observableLookup = {
    a: pipe(
      a,
      map(() => "a"),
    ),
    b: pipe(
      b,
      map(() => "b"),
    ),
    c: pipe(
      c,
      map(() => "c"),
    ),
    d: pipe(
      d,
      map(() => "d"),
    ),
  } as const;
  const source = new Subject<keyof typeof observableLookup>();
  const observable = pipe(
    source,
    flatMap((value) => observableLookup[value]),
  );

  // Act
  observable.subscribe(
    new Observer({
      next: (value) => notifications.push(["N", value]),
      return: () => notifications.push(["R"]),
      throw: (value) => notifications.push(["T", value]),
    }),
  );
  source.next("a");
  a.next();
  source.next("b");
  b.next();
  a.next();
  b.next();
  a.next();
  a.return();
  b.next();
  b.return();
  source.next("c");
  c.next();
  c.next();
  d.next();
  c.return();
  source.throw(error);
  d.next();
  d.next();
  d.return();
  source.return();

  // Assert
  assertEquals(notifications, [
    ["N", "a"],
    ["N", "a"],
    ["N", "a"],
    ["N", "b"],
    ["N", "c"],
    ["N", "c"],
    ["T", error],
  ]);
});
