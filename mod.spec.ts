import { assertEquals } from "@std/assert";
import { Subject } from "@xan/subject";
import { Observer } from "@xan/observer";
import { pipe } from "@xan/pipe";
import { flatMap } from "./mod.ts";
import { map } from "@xan/observable-map";
import { materialize, type Notification } from "@xan/observable-materialize";

Deno.test("flatMap should flatten many inners", () => {
  // Arrange
  const a = new Subject<void>();
  const b = new Subject<void>();
  const c = new Subject<void>();
  const d = new Subject<void>();
  const notifications: Array<Notification<string>> = [];
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
    materialize(),
  );

  // Act
  observable.subscribe(
    new Observer((notification) => notifications.push(notification)),
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
  const notifications: Array<Notification<string>> = [];
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
    materialize(),
  );

  // Act
  observable.subscribe(
    new Observer((notification) => notifications.push(notification)),
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
  const notifications: Array<Notification<string>> = [];
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
    materialize(),
  );

  // Act
  observable.subscribe(
    new Observer((notification) => notifications.push(notification)),
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
