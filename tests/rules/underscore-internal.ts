/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/underscore-internal");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("underscore-internal", rule, {
  valid: [
    {
      code: stripIndent`
        /**
         * Some constant
         */
        export const SOME_CONSTANT = 0;
      `,
    },
    {
      code: stripIndent`
        /**
         * Some internal constant with _
         * @internal
         */
        export const _SOME_CONSTANT = 0;
      `,
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        /**
         * Some internal constant without _
         * @internal
         */
        export const SOME_CONSTANT = 0;
                     ~~~~~~~~~~~~~ [forbidden]
      `
    ),
  ],
});
