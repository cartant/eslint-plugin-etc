/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import rule = require("../../source/rules/no-const-enum");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-const-enum", rule, {
  valid: [
    {
      code: `enum Numbers { one = 1 };`,
    },
    {
      code: `const enum Numbers { one = 1 };`,
      options: [
        {
          allowLocal: true,
        },
      ],
    },
  ],
  invalid: [
    {
      code: `const enum Numbers { one = 1 };`,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 12,
          endLine: 1,
          endColumn: 19,
        },
      ],
    },
    {
      code: `export const enum Numbers { one = 1 };`,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 19,
          endLine: 1,
          endColumn: 26,
        },
      ],
    },
    {
      code: `export const enum Numbers { one = 1 };`,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 19,
          endLine: 1,
          endColumn: 26,
        },
      ],
      options: [
        {
          allowLocal: false,
        },
      ],
    },
  ],
});
