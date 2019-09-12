/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/no-assign-mutated-array");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-assign-mutated-array", rule, {
  valid: [
    {
      code: stripIndent`
        const a = [0, 1, 2, 3];
        a.fill(0);
        a.reverse();
        a.sort((x, y) => x - y);
        a.splice(0, 1);
      `
    },
    {
      code: stripIndent`
        const a = [0, 1, 2, 3];
        const b = a;
        const c = a.map(x => x);
        const d = a.map(x => x).fill(0);
        const e = a.map(x => x).reverse();
        const f = a.map(x => x).sort((x, y) => x - y);
        const g = a.map(x => x).splice(0, 1);
      `
    },
    {
      code: stripIndent`
        const a = [0, 1, 2, 3];
        let b;
        b = a;
        b = a.map(x => x);
        b = a.map(x => x).fill(0);
        b = a.map(x => x).reverse();
        b = a.map(x => x).sort((x, y) => x - y);
        b = a.map(x => x).splice(0, 1);
      `
    },
    {
      code: stripIndent`
        const a = [0, 1, 2, 3];
        const b = a.slice().fill(0);
        const c = a.slice().reverse();
        const d = a.slice().sort((x, y) => x - y);
        const e = a.slice().splice(0, 1);
      `
    },
    {
      code: stripIndent`
        const a = [0, 1, 2, 3];
        let b;
        b = a.slice().fill(0);
        b = a.slice().reverse();
        b = a.slice().sort((x, y) => x - y);
        b = a.slice().splice(0, 1);
      `
    },
    {
      code: stripIndent`
        const a = [0, 1, 2, 3];
        let b;

        b = a.slice().fill(0).fill(0);
        b = a.slice().reverse().reverse();
        b = a.slice().sort((x, y) => x - y).sort((x, y) => x - y);
        b = a.slice().splice(0, 1).splice(0, 1);

        b = [...a].fill(0);
        b = [...a].reverse();
        b = [...a].sort((x, y) => x - y);
        b = [...a].splice(0, 1);

        b = [...a].fill(0).fill(0);
        b = [...a].reverse().reverse();
        b = [...a].sort((x, y) => x - y).sort((x, y) => x - y);
        b = [...a].splice(0, 1).splice(0, 1);
      `
    },
    {
      code: stripIndent`
        const a = [0, 1, 2, 3];
        const b = {
          a: a.map(x => x).fill(0),
          b: a.map(x => x).reverse(),
          c: a.map(x => x).sort((x, y) => x - y),
          d: a.map(x => x).splice(0, 1)
        };
      `
    },
    {
      code: stripIndent`
        const a = [0, 1, 2, 3];
        const b = [
          a.map(x => x).fill(0),
          a.map(x => x).reverse(),
          a.map(x => x).sort((x, y) => x - y),
          a.map(x => x).splice(0, 1)
        ];
      `
    },
    {
      code: stripIndent`
        const a = [0, 1, 2, 3];
        function n(p: number[]): void {}
        n(a.map(x => x).fill(0));
        n(a.map(x => x).reverse());
        n(a.map(x => x).sort((x, y) => x - y));
        n(a.map(x => x).splice(0, 1));
      `
    },
    {
      code: stripIndent`
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
      `
    }
  ],
  invalid: [
    {
      code: stripIndent`
        const a = [0, 1, 2, 3];
        const b = a.fill(0);
        const c = a.reverse();
        const d = a.sort((x, y) => x - y);
        const e = a.splice(0, 1);
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 2,
          column: 13,
          endLine: 2,
          endColumn: 17
        },
        {
          messageId: "forbidden",
          line: 3,
          column: 13,
          endLine: 3,
          endColumn: 20
        },
        {
          messageId: "forbidden",
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 17
        },
        {
          messageId: "forbidden",
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 19
        }
      ]
    },
    {
      code: stripIndent`
        const a = [0, 1, 2, 3];
        let b;
        b = a.fill(0);
        b = a.reverse();
        b = a.sort((x, y) => x - y);
        b = a.splice(0, 1);
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 7,
          endLine: 3,
          endColumn: 11
        },
        {
          messageId: "forbidden",
          line: 4,
          column: 7,
          endLine: 4,
          endColumn: 14
        },
        {
          messageId: "forbidden",
          line: 5,
          column: 7,
          endLine: 5,
          endColumn: 11
        },
        {
          messageId: "forbidden",
          line: 6,
          column: 7,
          endLine: 6,
          endColumn: 13
        }
      ]
    },
    {
      code: stripIndent`
        const a = [0, 1, 2, 3];
        const b = {
          a: a.fill(0),
          b: a.reverse(),
          c: a.sort((x, y) => x - y),
          d: a.splice(0, 1)
        };
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 8,
          endLine: 3,
          endColumn: 12
        },
        {
          messageId: "forbidden",
          line: 4,
          column: 8,
          endLine: 4,
          endColumn: 15
        },
        {
          messageId: "forbidden",
          line: 5,
          column: 8,
          endLine: 5,
          endColumn: 12
        },
        {
          messageId: "forbidden",
          line: 6,
          column: 8,
          endLine: 6,
          endColumn: 14
        }
      ]
    },
    {
      code: stripIndent`
        const a = [0, 1, 2, 3];
        const b = [
          a.fill(0),
          a.reverse(),
          a.sort((x, y) => x - y),
          a.splice(0, 1)
        ];
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 5,
          endLine: 3,
          endColumn: 9
        },
        {
          messageId: "forbidden",
          line: 4,
          column: 5,
          endLine: 4,
          endColumn: 12
        },
        {
          messageId: "forbidden",
          line: 5,
          column: 5,
          endLine: 5,
          endColumn: 9
        },
        {
          messageId: "forbidden",
          line: 6,
          column: 5,
          endLine: 6,
          endColumn: 11
        }
      ]
    },
    {
      code: stripIndent`
        const a = [0, 1, 2, 3];
        function n(p: number[]): void {}
        n(a.fill(0));
        n(a.reverse());
        n(a.sort((x, y) => x - y));
        n(a.splice(0, 1));
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 5,
          endLine: 3,
          endColumn: 9
        },
        {
          messageId: "forbidden",
          line: 4,
          column: 5,
          endLine: 4,
          endColumn: 12
        },
        {
          messageId: "forbidden",
          line: 5,
          column: 5,
          endLine: 5,
          endColumn: 9
        },
        {
          messageId: "forbidden",
          line: 6,
          column: 5,
          endLine: 6,
          endColumn: 11
        }
      ]
    },
    {
      code: stripIndent`
        const a = [0, 1, 2, 3];
        class Thing { contructor(p: number[]) {} }
        let t = new Thing(
          a.fill(0)
        );
        t = new Thing(
          a.reverse()
        );
        t = new Thing(
          a.sort((x, y) => x - y)
        );
        t = new Thing(
          a.splice(0, 1)
        );
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 5,
          endLine: 4,
          endColumn: 9
        },
        {
          messageId: "forbidden",
          line: 7,
          column: 5,
          endLine: 7,
          endColumn: 12
        },
        {
          messageId: "forbidden",
          line: 10,
          column: 5,
          endLine: 10,
          endColumn: 9
        },
        {
          messageId: "forbidden",
          line: 13,
          column: 5,
          endLine: 13,
          endColumn: 11
        }
      ]
    }
  ]
});
