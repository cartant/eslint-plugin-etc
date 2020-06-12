/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/no-missing-dollar-expect");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-missing-dollar-expect", rule, {
  valid: [
    {
      code: stripIndent`
        // Expectations with $
        const a = "a"; // $ExpectType string
        const b: number = "b"; // $ExpectError
      `,
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // Expectations without $
        const a = "a"; // ExpectType string
                       ~~~~~~~~~~~~~ [forbidden]
        const b: number = "b"; // ExpectError
                               ~~~~~~~~~~~~~~ [forbidden]
      `
    ),
  ],
});
