/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/no-array-foreach");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-array-foreach", rule, {
  valid: [
    stripIndent`
      // non-array
      import { of } from "rxjs";
      of(42).forEach(value => console.log(value));
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // literal
        [42].forEach(value => console.log(value));
             ~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // variable
        const values = [42];
        values.forEach(value => console.log(value));
               ~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // return value
        function values() { return [42]; }
        values().forEach(value => console.log(value));
                 ~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // property
        const instance = { values: [42] };
        instance.values.forEach(value => console.log(value));
                        ~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // from
        Array.from([42]).forEach(value => console.log(value));
                         ~~~~~~~ [forbidden]
      `
    ),
  ],
});
