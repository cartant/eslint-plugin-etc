/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/no-assign-mutated-array");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-assign-mutated-array", rule, {
  valid: [
    {
      code: stripIndent`
        // expression statements
        const a = [0, 1, 2, 3];
        a.fill(0);
        a.reverse();
        a.sort((x, y) => x - y);
        a.splice(0, 1);
      `,
    },
    {
      code: stripIndent`
        // mapped & mutated variable initialization
        const a = [0, 1, 2, 3];
        const b = a;
        const c = a.map(x => x);
        const d = a.map(x => x).fill(0);
        const e = a.map(x => x).reverse();
        const f = a.map(x => x).sort((x, y) => x - y);
        const g = a.map(x => x).splice(0, 1);
      `,
    },
    {
      code: stripIndent`
        // mapped & mutated variable assignment
        const a = [0, 1, 2, 3];
        let b;
        b = a;
        b = a.map(x => x);
        b = a.map(x => x).fill(0);
        b = a.map(x => x).reverse();
        b = a.map(x => x).sort((x, y) => x - y);
        b = a.map(x => x).splice(0, 1);
      `,
    },
    {
      code: stripIndent`
        // sliced & mutated variable initialization
        const a = [0, 1, 2, 3];
        const b = a.slice().fill(0);
        const c = a.slice().reverse();
        const d = a.slice().sort((x, y) => x - y);
        const e = a.slice().splice(0, 1);
      `,
    },
    {
      code: stripIndent`
        // sliced & mutated variable assignment
        const a = [0, 1, 2, 3];
        let b;
        b = a.slice().fill(0);
        b = a.slice().reverse();
        b = a.slice().sort((x, y) => x - y);
        b = a.slice().splice(0, 1);
      `,
    },
    {
      code: stripIndent`
        // twice-mutated variable assignment
        const a = [0, 1, 2, 3];
        let b;

        b = a.slice().fill(0).fill(0);
        b = a.slice().reverse().reverse();
        b = a.slice().sort((x, y) => x - y).sort((x, y) => x - y);
        b = a.slice().splice(0, 1).splice(0, 1);
      `,
    },
    {
      code: stripIndent`
        // spread & mutated variable assignment
        const a = [0, 1, 2, 3];
        let b;

        b = [...a].fill(0);
        b = [...a].reverse();
        b = [...a].sort((x, y) => x - y);
        b = [...a].splice(0, 1);

        b = [...a].fill(0).fill(0);
        b = [...a].reverse().reverse();
        b = [...a].sort((x, y) => x - y).sort((x, y) => x - y);
        b = [...a].splice(0, 1).splice(0, 1);
      `,
    },
    {
      code: stripIndent`
        // mapped & mutated property initialization
        const a = [0, 1, 2, 3];
        const b = {
          a: a.map(x => x).fill(0),
          b: a.map(x => x).reverse(),
          c: a.map(x => x).sort((x, y) => x - y),
          d: a.map(x => x).splice(0, 1)
        };
      `,
    },
    {
      code: stripIndent`
        // mapped & mutated array initialization
        const a = [0, 1, 2, 3];
        const b = [
          a.map(x => x).fill(0),
          a.map(x => x).reverse(),
          a.map(x => x).sort((x, y) => x - y),
          a.map(x => x).splice(0, 1)
        ];
      `,
    },
    {
      code: stripIndent`
        // mapped & mutated function arguments
        const a = [0, 1, 2, 3];
        function n(p: number[]): void {}
        n(a.map(x => x).fill(0));
        n(a.map(x => x).reverse());
        n(a.map(x => x).sort((x, y) => x - y));
        n(a.map(x => x).splice(0, 1));
      `,
    },
    {
      code: stripIndent`
        // mapped & mutated constructor arguments
        const a = [0, 1, 2, 3];
        class Thing { contructor(p: number[]) {} }
        t = new Thing(
          a.map(x => x).fill(0)
        );
        t = new Thing(
          a.map(x => x).reverse()
        );
        t = new Thing(
          a.map(x => x).sort((x, y) => x - y)
        );
        t = new Thing(
          a.map(x => x).splice(0, 1)
        );
      `,
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // mutated variable initialization
        const a = [0, 1, 2, 3];
        const b = a.fill(0);
                    ~~~~ [forbidden]
        const c = a.reverse();
                    ~~~~~~~ [forbidden]
        const d = a.sort((x, y) => x - y);
                    ~~~~ [forbidden]
        const e = a.splice(0, 1);
                    ~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // mutated variable assignment
        const a = [0, 1, 2, 3];
        let b;
        b = a.fill(0);
              ~~~~ [forbidden]
        b = a.reverse();
              ~~~~~~~ [forbidden]
        b = a.sort((x, y) => x - y);
              ~~~~ [forbidden]
        b = a.splice(0, 1);
              ~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // mutated property initialization
        const a = [0, 1, 2, 3];
        const b = {
          a: a.fill(0),
               ~~~~ [forbidden]
          b: a.reverse(),
               ~~~~~~~ [forbidden]
          c: a.sort((x, y) => x - y),
               ~~~~ [forbidden]
          d: a.splice(0, 1)
               ~~~~~~ [forbidden]
        };
      `
    ),
    fromFixture(
      stripIndent`
        // mutated array initialization
        const a = [0, 1, 2, 3];
        const b = [
          a.fill(0),
            ~~~~ [forbidden]
          a.reverse(),
            ~~~~~~~ [forbidden]
          a.sort((x, y) => x - y),
            ~~~~ [forbidden]
          a.splice(0, 1)
            ~~~~~~ [forbidden]
        ];
      `
    ),
    fromFixture(
      stripIndent`
        // mutated function arguments
        const a = [0, 1, 2, 3];
        function n(p: number[]): void {}
        n(a.fill(0));
            ~~~~ [forbidden]
        n(a.reverse());
            ~~~~~~~ [forbidden]
        n(a.sort((x, y) => x - y));
            ~~~~ [forbidden]
        n(a.splice(0, 1));
            ~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // mutated constructor arguments
        const a = [0, 1, 2, 3];
        class Thing { contructor(p: number[]) {} }
        let t = new Thing(
          a.fill(0)
            ~~~~ [forbidden]
        );
        t = new Thing(
          a.reverse()
            ~~~~~~~ [forbidden]
        );
        t = new Thing(
          a.sort((x, y) => x - y)
            ~~~~ [forbidden]
        );
        t = new Thing(
          a.splice(0, 1)
            ~~~~~~ [forbidden]
        );
      `
    ),
  ],
});
