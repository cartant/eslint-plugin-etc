/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import rule = require("../../source/rules/ban-imports");
import { ruleTester } from "../utils";

const options = [
  {
    "^a$": true,
    "^b$": false,
    "(^|/)c$": true
  }
];

ruleTester({ types: false }).run("ban-imports", rule, {
  valid: [
    {
      code: `import { b } from "b";`,
      options
    },
    {
      code: `import { d } from "./d";`,
      options
    }
  ],
  invalid: [
    {
      code: `import { a } from "a";`,
      options,
      errors: [
        {
          messageId: "forbidden"
        }
      ]
    },
    {
      code: `import { c } from "./c";`,
      options,
      errors: [
        {
          messageId: "forbidden"
        }
      ]
    }
  ]
});
