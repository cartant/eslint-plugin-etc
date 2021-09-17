/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/prefer-less-than");
import { ruleTester } from "../utils";

ruleTester({ types: false }).run("prefer-less-than", rule, {
  valid: [
    `const result = 42 < 54;`,
    `const result = 42 <= 54;`,
    `const result = 42 == 54;`,
    `const result = 42 === 54;`,
    `const result = 42 != 54;`,
    `const result = 42 !== 54;`,
    `if (a < x && x < b) { /* .. */ }`,
    `if (a <= x && x <= b) { /* .. */ }`,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        const result = 54 > 42;
                       ~~~~~~~ [forbiddenGT]
       `,
      {
        output: stripIndent`
          const result = 42 < 54;
        `,
        suggestions: [
          {
            messageId: "suggestLT",
            output: stripIndent`
              const result = 42 < 54;
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        const result = 54 >= 42;
                       ~~~~~~~~ [forbiddenGTE]
       `,
      {
        output: stripIndent`
          const result = 42 <= 54;
        `,
        suggestions: [
          {
            messageId: "suggestLTE",
            output: stripIndent`
              const result = 42 <= 54;
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        const result = 54.0 > 42;
                       ~~~~~~~~~ [forbiddenGT]
       `,
      {
        output: stripIndent`
          const result = 42 < 54.0;
        `,
        suggestions: [
          {
            messageId: "suggestLT",
            output: stripIndent`
              const result = 42 < 54.0;
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        const result = 54.0 >= 42;
                       ~~~~~~~~~~ [forbiddenGTE]
       `,
      {
        output: stripIndent`
          const result = 42 <= 54.0;
        `,
        suggestions: [
          {
            messageId: "suggestLTE",
            output: stripIndent`
              const result = 42 <= 54.0;
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        const result = 54 > 42.0;
                       ~~~~~~~~~ [forbiddenGT]
       `,
      {
        output: stripIndent`
          const result = 42.0 < 54;
        `,
        suggestions: [
          {
            messageId: "suggestLT",
            output: stripIndent`
              const result = 42.0 < 54;
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        const result = 54 >= 42.0;
                       ~~~~~~~~~~ [forbiddenGTE]
       `,
      {
        output: stripIndent`
          const result = 42.0 <= 54;
        `,
        suggestions: [
          {
            messageId: "suggestLTE",
            output: stripIndent`
              const result = 42.0 <= 54;
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        if (x > a && x < b) { /* .. */ }
            ~~~~~ [forbiddenGT]
       `,
      {
        output: stripIndent`
          if (a < x && x < b) { /* .. */ }
        `,
        suggestions: [
          {
            messageId: "suggestLT",
            output: stripIndent`
              if (a < x && x < b) { /* .. */ }
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        if (x >= a && x <= b) { /* .. */ }
            ~~~~~~ [forbiddenGTE]
       `,
      {
        output: stripIndent`
          if (a <= x && x <= b) { /* .. */ }
        `,
        suggestions: [
          {
            messageId: "suggestLTE",
            output: stripIndent`
              if (a <= x && x <= b) { /* .. */ }
            `,
          },
        ],
      }
    ),
  ],
});
