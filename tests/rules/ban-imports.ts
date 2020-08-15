/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/ban-imports");
import { ruleTester } from "../utils";

const defaultMessage = "This import location is forbidden.";
const options = [
  {
    "^a$": true,
    "^b$": false,
    "(^|/)c$": true,
    "^m$": "'m' has been deprecated; use 'baz'",
    "^n$": "",
  },
];

ruleTester({ types: false }).run("ban-imports", rule, {
  valid: [
    {
      code: `import { b } from "b";`,
      options,
    },
    {
      code: `import { d } from "./d";`,
      options,
    },
    {
      code: `import { n } from "n";`,
      options,
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        import { a } from "a";
        ~~~~~~~~~~~~~~~~~~~~~~ [forbidden { "message": "${defaultMessage}" }]
      `,
      { options }
    ),
    fromFixture(
      stripIndent`
        import { c } from "./c";
        ~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden { "message": "${defaultMessage}" }]
      `,
      { options }
    ),
    fromFixture(
      stripIndent`
        import { m } from "m";
        ~~~~~~~~~~~~~~~~~~~~~~ [forbidden { "message": "'m' has been deprecated; use 'baz'" }]
      `,
      { options }
    ),
  ],
});
