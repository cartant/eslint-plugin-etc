/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/ban-imports");
import { ruleTester } from "../utils";

const options = [
  {
    "^a$": true,
    "^b$": false,
    "(^|/)c$": true,
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
  ],
  invalid: [
    fromFixture(
      stripIndent`
        import { a } from "a";
        ~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
      `,
      { options }
    ),
    fromFixture(
      stripIndent`
        import { c } from "./c";
        ~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
      `,
      { options }
    ),
  ],
});
