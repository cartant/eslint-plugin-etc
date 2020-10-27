/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/prefer-interface");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("prefer-interface", rule, {
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
        export type Identity<T> = (value: T) => T;
                    ~~~~~~~~ [forbidden]
      `,
      {
        options: [{ allowLocal: true }],
        output: stripIndent`
          export interface Identity<T> { (value: T): T; }
        `,
      }
    ),
  ],
});
