/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/no-t");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-t", rule, {
  valid: [
    {
      code: `type Thing<Value> = { value: Value };`,
    },
    {
      code: `type Thing<TValue> = { value: TValue };`,
      options: [{ prefix: "T" }],
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        type Thing<T> = { value: T };
                   ~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        type Thing<Value> = { value: Value };
                   ~~~~~ [prefix]
      `,
      { options: [{ prefix: "T" }] }
    ),
  ],
});
