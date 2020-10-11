/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/no-foreach");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-foreach", rule, {
  valid: [
    {
      code: stripIndent`
        // observable
        import { of } from "rxjs";
        of(42).forEach(value => console.log(value));
      `,
    },
    {
      code: stripIndent`
        // map variable with options
        const map = new Map<string, string>();
        map.forEach((value) => console.log(value));
      `,
      options: [{ types: ["Array"] }],
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // array literal
        [42].forEach(value => console.log(value));
             ~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // array variable
        const values = [42];
        values.forEach(value => console.log(value));
               ~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // array return value
        function values() { return [42]; }
        values().forEach(value => console.log(value));
                 ~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // array property
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
    fromFixture(
      stripIndent`
        // map variable
        const map = new Map<string, string>();
        map.forEach((value) => console.log(value));
            ~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // set variable
        const set = new Set<string>();
        set.forEach((value) => console.log(value));
            ~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // node list variable
        class Node {}
        class NodeList {
          forEach(callback: (node: Node, index: number, list: NodeList) => void) {}
        }
        const list = new NodeList();
        list.forEach((node) => console.log(node));
             ~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
      // array variable with options
      const values = [42];
      values.forEach(value => console.log(value));
             ~~~~~~~ [forbidden]

      `,
      {
        options: [{ types: ["Array"] }],
      }
    ),
  ],
});
