/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/prefer-interface");
import { ruleTester } from "../utils";

ruleTester({ types: false }).run("prefer-interface", rule, {
  valid: [
    `type T = string;`,
    `type T = string | number;`,
    `type T = "zero";`,
    `type T = "zero" | "one";`,
    `type T = { length: number; } | { width: number; };`,
    `type T = { length: number; } & { width: number; };`,
    `type T = Set<string>;`,
    `type DeepReadonly<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> }`,
    {
      code: `type T = { length: number; };`,
      options: [{ allowLocal: true }],
    },
    {
      code: `type T = (value: string) => string;`,
      options: [{ allowLocal: true }],
    },
    {
      code: `
        // type intersection
        type Name = { name: string; };
        type Age = { age: number; };
        type T = Name & Age;
      `,
      options: [{ allowLocal: true }],
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        type T = { length: number; };
             ~ [forbidden]
      `,
      {
        output: stripIndent`
          interface T { length: number; }
        `,
      }
    ),
    fromFixture(
      stripIndent`
        export type T = { length: number; };
                    ~ [forbidden]
      `,
      {
        options: [{ allowLocal: true }],
        output: stripIndent`
          export interface T { length: number; }
        `,
      }
    ),
    fromFixture(
      stripIndent`
        type T = {
             ~ [forbidden]
          length: number;
          width: number;
        };
      `,
      {
        output: stripIndent`
          interface T {
            length: number;
            width: number;
          }
        `,
      }
    ),
    fromFixture(
      stripIndent`
        type T = (value: string) => string;
             ~ [forbidden]
      `,
      {
        output: stripIndent`
          interface T { (value: string): string; }
        `,
      }
    ),
    fromFixture(
      stripIndent`
        export type T = (value: string) => string;
                    ~ [forbidden]
      `,
      {
        options: [{ allowLocal: true }],
        output: stripIndent`
          export interface T { (value: string): string; }
        `,
      }
    ),
    fromFixture(
      stripIndent`
        type T = (value: unknown) => value is string;
             ~ [forbidden]
      `,
      {
        output: stripIndent`
          interface T { (value: unknown): value is string; }
        `,
      }
    ),
    fromFixture(
      stripIndent`
        type T<V> = { value: V; };
             ~ [forbidden]
      `,
      {
        output: stripIndent`
          interface T<V> { value: V; }
        `,
      }
    ),
    fromFixture(
      stripIndent`
        type Pair<L, R> = {
             ~~~~ [forbidden]
          left: L;
          right: R;
        };
      `,
      {
        output: stripIndent`
          interface Pair<L, R> {
            left: L;
            right: R;
          }
        `,
      }
    ),
    fromFixture(
      stripIndent`
        type Identity<T> = (value: T) => T;
             ~~~~~~~~ [forbidden]
      `,
      {
        output: stripIndent`
          interface Identity<T> { (value: T): T; }
        `,
      }
    ),
    fromFixture(
      stripIndent`
        type Func<Foo> = <Bar>(foo: Foo) => Bar;
             ~~~~ [forbidden]
      `,
      {
        output: stripIndent`
          interface Func<Foo> { <Bar>(foo: Foo): Bar; }
        `,
      }
    ),
  ],
});

ruleTester({ types: true }).run("prefer-interface", rule, {
  valid: [
    stripIndent`
      // union intersection
      type Name = { name: string; } | { label: string; };
      interface Age { age: number; }
      type T = Name & Age;
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // interface intersection
        interface Name { name: string; }
        interface Age { age: number; }
        type T = Name & Age;
             ~ [forbidden]
      `,
      {
        options: [{ allowIntersection: false }],
        output: stripIndent`
          // interface intersection
          interface Name { name: string; }
          interface Age { age: number; }
          interface T extends Name, Age {}
        `,
      }
    ),
    fromFixture(
      stripIndent`
        // generic interface intersection
        interface Name<S> { name: S; }
        interface Age<N> { age: N; }
        type T<S, N> = Name<S> & Age<N>;
             ~ [forbidden]
      `,
      {
        options: [{ allowIntersection: false }],
        output: stripIndent`
          // generic interface intersection
          interface Name<S> { name: S; }
          interface Age<N> { age: N; }
          interface T<S, N> extends Name<S>, Age<N> {}
        `,
      }
    ),
    fromFixture(
      stripIndent`
        // interface-literal intersection
        interface Name { name: string; }
        type T = Name & { age: number; };
             ~ [forbidden]
      `,
      {
        options: [{ allowIntersection: false }],
        output: stripIndent`
          // interface-literal intersection
          interface Name { name: string; }
          interface T extends Name { age: number; }
        `,
      }
    ),
    fromFixture(
      stripIndent`
        // literal-interface intersection
        interface Age { age: number; }
        type T = { name: string; } & Age;
             ~ [forbidden]
      `,
      {
        options: [{ allowIntersection: false }],
        output: stripIndent`
          // literal-interface intersection
          interface Age { age: number; }
          interface T extends Age { name: string; }
        `,
      }
    ),
    fromFixture(
      stripIndent`
        // interface-literal-interface intersection
        interface Name { name: string; }
        interface Role { role: string; }
        type T = Name & { age: number; } & Role;
             ~ [forbidden]
      `,
      {
        options: [{ allowIntersection: false }],
        output: stripIndent`
          // interface-literal-interface intersection
          interface Name { name: string; }
          interface Role { role: string; }
          interface T extends Name, Role { age: number; }
        `,
      }
    ),
  ],
});
