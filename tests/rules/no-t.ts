/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import rule = require("../../source/rules/no-t");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-t", rule, {
  valid: [
    {
      code: `type Thing<Value> = { value: Value };`
    },
    {
      code: `type Thing<TValue> = { value: TValue };`,
      options: [{ prefix: "T" }]
    }
  ],
  invalid: [
    {
      code: `type Thing<T> = { value: T };`,
      errors: [
        {
          data: { name: "T" },
          messageId: "forbidden",
          line: 1,
          column: 12,
          endLine: 1,
          endColumn: 13
        }
      ]
    },
    {
      code: `type Thing<Value> = { value: Value };`,
      errors: [
        {
          data: { name: "Value", prefix: "T" },
          messageId: "forbidden",
          line: 1,
          column: 12,
          endLine: 1,
          endColumn: 17
        }
      ],
      options: [{ prefix: "T" }]
    }
  ]
});
