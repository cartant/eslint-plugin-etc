/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import rule = require("../../source/rules/no-enum");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-enum", rule, {
  invalid: [
    {
      code: `enum Numbers { one = 1 };`,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 6,
          endLine: 1,
          endColumn: 13
        }
      ]
    },
    {
      code: `export enum Numbers { one = 1 };`,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 20
        }
      ]
    },
    {
      code: `const enum Numbers { one = 1 };`,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 12,
          endLine: 1,
          endColumn: 19
        }
      ]
    },
    {
      code: `export const enum Numbers { one = 1 };`,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 19,
          endLine: 1,
          endColumn: 26
        }
      ]
    }
  ]
});
