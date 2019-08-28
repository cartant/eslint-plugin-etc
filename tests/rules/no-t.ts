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
    }
  ],
  invalid: [
    {
      code: `type Thing<T> = { value: T };`,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 12,
          endLine: 1,
          endColumn: 13
        }
      ]
    }
  ]
});
