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
        type T = (value: unknown) => value is string;
             ~ [forbidden]
      `,
      {
        output: stripIndent`
          interface T { (value: unknown): value is string; }
        `,
      }
    ),
  ],
});
