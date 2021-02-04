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
      `,
    },
    {
      code: stripIndent`
        // sliced & mutated variable initialization
        const a = [0, 1, 2, 3];
        const b = a.slice().fill(0);
        const c = a.slice().reverse();
        const d = a.slice().sort((x, y) => x - y);
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
      `,
    },
    {
      code: stripIndent`
        // spliced & mutated variable initialization
        const a = [0, 1, 2, 3];
        const b = a.splice(0, 1).fill(0);
        const c = a.splice(0, 1).reverse();
        const d = a.splice(0, 1).sort((x, y) => x - y);
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

        b = [...a].fill(0).fill(0);
        b = [...a].reverse().reverse();
        b = [...a].sort((x, y) => x - y).sort((x, y) => x - y);
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
      `,
    },
    {
      code: stripIndent`
        // https://github.com/cartant/eslint-plugin-etc/issues/27
        const a = new Array(10).fill(0);
        const b = Array(10).fill(0);
        const c = Array.from([0, 1, 2]).reverse();
        const d = Array.of(0, 1, 2).sort();
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
      `
    ),
    fromFixture(
      stripIndent`
        // mutated then chained variable initialization
        const a = [0, 1, 2, 3];
        const b = a.fill(0).map(x => x);
                    ~~~~ [forbidden]
        const c = a.reverse().map(x => x);
                    ~~~~~~~ [forbidden]
        const d = a.sort((x, y) => x - y).map(x => x);
                    ~~~~ [forbidden]
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
      `
    ),
  ],
});
