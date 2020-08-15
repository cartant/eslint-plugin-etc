/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 * Portions of this file are copyright 2017 Klaus Meinhardt - see THIRD_PARTY_NOTICES.
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/no-misused-generics");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-misused-generics", rule, {
  valid: [
    {
      code: stripIndent`
        declare function get(): void;
        declare function get<T>(param: T[]): T;
      `,
    },
    {
      code: stripIndent`
        declare function identity<T>(param: T): T; // this is valid as it constrains the return type to the parameter type
      `,
    },
    {
      code: stripIndent`
        declare function compare<T>(param1: T, param2: T): boolean; // this is valid because it enforces comparable types for both parameters
        declare function compare<T, U extends T>(param1: T, param2: U): boolean; // this is also valid because T constrains U
      `,
    },
    {
      code: stripIndent`
        // type parameters in implementations are always necessary, because they enforce type safety in the function body
        function doStuff<K, V>(map: Map<K, V>, key: K) {
          let v = map.get(key);
          v = 1; // this error disappears if V is replaced with any
          map.set(key, v);
          return v; // signature has implicit return type V, but we cannot know that without type information
        }
      `,
    },
  ],
  invalid: [
    fromFixture(stripIndent`
      declare function get<T>(): T;
                           ~ [cannotInfer]
      get<string>();
    `),
    fromFixture(stripIndent`
      declare function get<T extends object>(): T;
                           ~~~~~~~~~~~~~~~~ [cannotInfer]
      declare function get<T, U = T>(param: U): U;
                           ~ [cannotInfer]
      declare function get<T, U extends T = T>(param: T): U;
                              ~~~~~~~~~~~~~~~ [cannotInfer]
      declare function get<T extends string, U>(param: Record<T, U>): boolean;
                           ~~~~~~~~~~~~~~~~ [canReplace]
                                             ~ [canReplace]
      declare function get<T>(param: <T, U>(param: T) => U): T;
                           ~ [cannotInfer]
                                      ~ [canReplace]
                                         ~ [cannotInfer]
    `),
    fromFixture(stripIndent`
      function fn<T>(param: string) {
                  ~ [cannotInfer]
        let v: T = null!;
        return v;
      }
    `),
    fromFixture(stripIndent`
      declare class C<V> {
        method<T, U>(param: T): U;
               ~ [canReplace]
                  ~ [cannotInfer]
        prop: <T>() => T;
               ~ [cannotInfer]
      }
    `),
    fromFixture(stripIndent`
      <T,>(param): T => null!;
       ~ [cannotInfer]
    `),
    fromFixture(stripIndent`
      declare function take<T>(param: T): void; // T not used as constraint -> could just be any
                            ~ [canReplace]
      declare function take<T extends object>(param: T): void; // could just use object
                            ~~~~~~~~~~~~~~~~ [canReplace]
      declare function take<T, U = T>(param1: T, param2: U): void; // no constraint
                            ~ [canReplace]
                               ~~~~~ [canReplace]
      declare function take<T, U extends T>(param: T): U; // U is only used in the return type
                               ~~~~~~~~~~~ [cannotInfer]
      declare function take<T, U extends T>(param: U): U; // T cannot be inferred
                            ~ [cannotInfer]
    `),
    fromFixture(stripIndent`
      declare class Foo {
        prop: string;
        getProp<T>(this: Record<'prop', T>): T;
        compare<T>(this: Record<'prop', T>, other: Record<'prop', T>): number;
        foo<T>(this: T): void;
            ~ [canReplace]
      }
    `),
  ],
});
