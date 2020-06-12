/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
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
    fromFixture(
      stripIndent`
        const enum Numbers { one = 1 };
                   ~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        export const enum Numbers { one = 1 };
                          ~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        export const enum Numbers { one = 1 };
                          ~~~~~~~ [forbidden]
      `,
      {},
      {
        options: [
          {
            allowLocal: false,
          },
        ],
      }
    ),
  ],
});
