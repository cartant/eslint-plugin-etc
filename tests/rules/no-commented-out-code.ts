/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/no-commented-out-code");
import { ruleTester } from "../utils";

ruleTester({ types: false }).run("no-commented-out-code", rule, {
  valid: [
    {
      code: stripIndent`
        // This comment isn't code.
        const answer = 42;
      `,
    },
    {
      code: stripIndent`
        // This comment includes some code:
        // const answer = 54;
        const answer = 42;
      `,
    },
    {
      code: stripIndent`
        /* This comment isn't code. */
        const answer = 42;
      `,
    },
    {
      code: stripIndent`
        /*
        This comment includes some code:
        const answer = 54;
        */
        const answer = 42;
      `,
    },
    {
      code: stripIndent`
        /*
         * This comment isn't code.
         */
        const answer = 42;
      `,
    },
    {
      code: stripIndent`
        /*
         * This comment includes some code:
         * const answer = 54;
         */
        const answer = 42;
      `,
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // const answer = 54;
        ~~~~~~~~~~~~~~~~~~~~~ [forbidden]
        const answer = 42;
      `
    ),
    fromFixture(
      stripIndent`
        /* const answer = 54; */
        ~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
        const answer = 42;
      `
    ),
    {
      code: stripIndent`
        /*
         * const answer = 54;
         */
        const answer = 42;
      `,
      errors: [
        {
          column: 1,
          endColumn: 4,
          line: 1,
          endLine: 3,
          messageId: "forbidden",
        },
      ],
    },
    {
      code: stripIndent`
        // // Wrong answer
        // const answer = 54;
        const answer = 42;
      `,
      errors: [
        {
          column: 1,
          endColumn: 22,
          line: 1,
          endLine: 2,
          messageId: "forbidden",
        },
      ],
    },
    {
      code: stripIndent`
        // /* Wrong answer */
        // const answer = 54;
        const answer = 42;
      `,
      errors: [
        {
          column: 1,
          endColumn: 22,
          line: 1,
          endLine: 2,
          messageId: "forbidden",
        },
      ],
    },
    {
      code: stripIndent`
        /*
        // Wrong answer
        const answer = 54;
        */
        const answer = 42;
      `,
      errors: [
        {
          column: 1,
          endColumn: 3,
          line: 1,
          endLine: 4,
          messageId: "forbidden",
        },
      ],
    },
    {
      code: stripIndent`
        /*
         * // Wrong answer
         * const answer = 54;
         */
        const answer = 42;
      `,
      errors: [
        {
          column: 1,
          endColumn: 4,
          line: 1,
          endLine: 4,
          messageId: "forbidden",
        },
      ],
    },
  ],
});
