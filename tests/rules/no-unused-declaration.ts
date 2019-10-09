/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/no-unused-declaration");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-unused-declaration", rule, {
  valid: [
    {
      code: stripIndent`
        // any
        const a = "a";
        let b = "b";
        var c = "c";

        const d: any = { a, b, c };
        console.log(d.e);
      `
    },
    {
      code: stripIndent`
        // exported
        export const a = "a";
        export let b = "b";
        export var c = "c";

        export function f(): void {}
        export function g(): void {}

        export class Person {}
        export enum WTF { TRUE, FALSE, FILE_NOT_FOUND }
      `
    },
    {
      code: stripIndent`
        // ignored
        /* @jsx jsx */
        import { jsx } from "@emotion/core";

        export const Component = () => <span>Component</span>;
      `,
      options: [
        {
          ignored: {
            jsx: true
          }
        }
      ]
    },
    {
      code: stripIndent`
        // used classes
        class Person {}

        console.log(new Person());
      `
    },
    {
      code: stripIndent`
        // used destructuring
        const instance = { property: 42 };
        const array = [54];

        console.log(instance, array);

        const { property } = instance;
        const { property: renamed } = instance;
        const [element] = array;

        function f({ name }: { name?: string }): void {}
        function g({ name: renamed }: { name?: string }): void {}

        console.log(property, renamed, element, f.toString(), g.toString());

        const { a, b, ...rest } = { a: 1, b: 2, c: 3 };

        console.log(a, b, rest);
      `
    },
    {
      code: stripIndent`
        // used enums
        enum WTF { TRUE, FALSE, FILE_NOT_FOUND }

        console.log(WTF.FILE_NOT_FOUND);
      `
    },
    {
      code: stripIndent`
        // used const enums
        const enum WTF { TRUE, FALSE, FILE_NOT_FOUND }

        console.log(WTF.FILE_NOT_FOUND);
      `
    },
    {
      code: stripIndent`
        // used functions object shorthand
        function a(): void {}

        function b(x: string): void;
        function b(x: number, y: number): void;
        function b(...args: any[]): void {}

        const c = { a, b, d };
        console.log(c);

        function d(): void {}
      `
    },
    {
      code: stripIndent`
        // used functions
        function f(): void {}
        const g = () => {};

        console.log(f.toString(), g.toString());
      `
    },
    {
      code: stripIndent`
        // used imports object calculated
        import { a, b, c } from "./letters";

        const d = { [a]: a, [b]: "b", ["c"]: c };
        console.log(d);
      `
    },
    {
      code: stripIndent`
        // used imports object properties
        import { a, b, c } from "./letters";

        const d = { a: a, b: b, c: c };
        console.log(d);
      `
    },
    {
      code: stripIndent`
        // used imports object shorthand
        import { a, b, c } from "./letters";

        const d = { a, b, c };
        console.log(d);
      `
    },
    {
      code: stripIndent`
        // used imports
        import { a } from "./letters";
        import { a as alias } from "./letters";
        import * as l from "./letters";
        import letters from "./letters";
        import L, { e } from "./letters";

        console.log(a, alias, l.a, letters, L, e);
      `
    },
    {
      code: stripIndent`
        // used types
        interface SomeInterface {}
        type SomeType = {};

        declare const a: SomeInterface;
        declare const b: SomeType;

        console.log(a, b);
      `
    },
    {
      code: stripIndent`
        // used type imports
        import { Thing } from "./thing";

        const t: Thing | null = null;
        console.log(t);
      `
    },
    {
      code: stripIndent`
        // used variables object calculated
        const a = "a";
        let b = "b";
        var c = "c";

        const d = { [a]: a, [b]: "b", ["c"]: c };
        console.log(d);
      `
    },
    {
      code: stripIndent`
        // used variables object properties
        const a = "a";
        let b = "b";
        var c = "c";

        const d = { a: a, b: b, c: c };
        console.log(d);
      `
    },
    {
      code: stripIndent`
        // used variables object shorthand
        const a = "a";
        let b = "b";
        var c = "c";

        const d = { a, b, c };
        console.log(d);
      `
    },
    {
      code: stripIndent`
        // used variables
        const a = "a";
        let b = "b";
        var c = "c";

        console.log(a, b, c);
      `
    }
  ],
  invalid: [
    {
      code: stripIndent`
        // only declarations
        import { a } from "./letters";
        import { a as alias } from "./letters";
        import * as l from "./letters";
        import letters from "./letters";
        import L, { e } from "./letters";

        const x = "x";
        const [y] = ["y"];
        const { z } = { z: "z" };
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 8,
          column: 7,
          endLine: 8,
          endColumn: 8
        },
        {
          messageId: "forbidden",
          line: 9,
          column: 8,
          endLine: 9,
          endColumn: 9
        },
        {
          messageId: "forbidden",
          line: 10,
          column: 9,
          endLine: 10,
          endColumn: 10
        }
      ],
      options: [
        {
          declarations: true,
          imports: false
        }
      ],
      output: stripIndent`
        // only declarations
        import { a } from "./letters";
        import { a as alias } from "./letters";
        import * as l from "./letters";
        import letters from "./letters";
        import L, { e } from "./letters";

        const x = "x";
        const [y] = ["y"];
        const { z } = { z: "z" };
      `
    },
    {
      code: stripIndent`
        // only imports
        import { a } from "./letters";
        import { a as alias } from "./letters";
        import * as l from "./letters";
        import letters from "./letters";
        import L, { e } from "./letters";

        const x = "x";
        const [y] = ["y"];
        const { z } = { z: "z" };
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 2,
          column: 10,
          endLine: 2,
          endColumn: 11
        },
        {
          messageId: "forbidden",
          line: 3,
          column: 15,
          endLine: 3,
          endColumn: 20
        },
        {
          messageId: "forbidden",
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 14
        },
        {
          messageId: "forbidden",
          line: 5,
          column: 8,
          endLine: 5,
          endColumn: 15
        },
        {
          messageId: "forbidden",
          line: 6,
          column: 8,
          endLine: 6,
          endColumn: 9
        },
        {
          messageId: "forbidden",
          line: 6,
          column: 13,
          endLine: 6,
          endColumn: 14
        }
      ],
      options: [
        {
          declarations: false,
          imports: true
        }
      ]
      // TODO:
      // output: stripIndent`
      //   // only imports
      //   const x = "x";
      //   const [y] = ["y"];
      //   const { z } = { z: "z" };
      // `
    },
    {
      code: stripIndent`
        // reassigned
        const a = "a";
        let b = "b";
        var c = "c";

        b = a;
        c = a;
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 5,
          endLine: 3,
          endColumn: 6
        },
        {
          messageId: "forbidden",
          line: 4,
          column: 5,
          endLine: 4,
          endColumn: 6
        }
      ],
      output: stripIndent`
        // reassigned
        const a = "a";
        let b = "b";
        var c = "c";

        b = a;
        c = a;
      `
    },
    {
      code: stripIndent`
        // shadowed
        import { b } from "./letters";
        const a = "a";

        export function f(a: string, b: string): void {
            console.log(a, b);
        }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 2,
          column: 10,
          endLine: 2,
          endColumn: 11
        },
        {
          messageId: "forbidden",
          line: 3,
          column: 7,
          endLine: 3,
          endColumn: 8
        }
      ]
      // TODO:
      // output: stripIndent`
      //   // shadowed
      //   const a = "a";

      //   export function f(a: string, b: string): void {
      //       console.log(a, b);
      //   }
      // `
    },
    {
      code: stripIndent`
        // some used imports
        import { a, b, c } from "./letters";
        import {
          a as apple,
          b as banana,
          c as cherry
        } from "./letters";

        import t, { d } from "./letters";
        import u, { e as egg } from "./letters";

        import v, { f } from "./letters";
        import w, { g as grape } from "./letters";

        console.log(b, banana, t, u);
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 2,
          column: 10,
          endLine: 2,
          endColumn: 11
        },
        {
          messageId: "forbidden",
          line: 2,
          column: 16,
          endLine: 2,
          endColumn: 17
        },
        {
          messageId: "forbidden",
          line: 4,
          column: 8,
          endLine: 4,
          endColumn: 13
        },
        {
          messageId: "forbidden",
          line: 6,
          column: 8,
          endLine: 6,
          endColumn: 14
        },
        {
          messageId: "forbidden",
          line: 9,
          column: 13,
          endLine: 9,
          endColumn: 14
        },
        {
          messageId: "forbidden",
          line: 10,
          column: 18,
          endLine: 10,
          endColumn: 21
        },
        {
          messageId: "forbidden",
          line: 12,
          column: 8,
          endLine: 12,
          endColumn: 9
        },
        {
          messageId: "forbidden",
          line: 12,
          column: 13,
          endLine: 12,
          endColumn: 14
        },
        {
          messageId: "forbidden",
          line: 13,
          column: 8,
          endLine: 13,
          endColumn: 9
        },
        {
          messageId: "forbidden",
          line: 13,
          column: 18,
          endLine: 13,
          endColumn: 23
        }
      ]
      // TODO:
      // output: stripIndent`
      //   // some used imports
      //   import { b } from "./letters";
      //   import {
      //     b as banana
      //   } from "./letters";

      //   import t from "./letters";
      //   import u from "./letters";

      //   console.log(b, banana, t, u);
      // `
    },
    {
      code: stripIndent`
        // unused classes
        class Person {}
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 2,
          column: 7,
          endLine: 2,
          endColumn: 13
        }
      ],
      output: stripIndent`
        // unused classes
        class Person {}
      `
    },
    {
      code: stripIndent`
        // unused destructuring
        const instance = { property: 42 };
        const array = [54];

        console.log(instance, array);

        const { property } = instance;
        const { property: renamed } = instance;
        const [element] = array;

        function f({ name }: { name?: string }): void {}
        function g({ name: renamed }: { name?: string }): void {}

        console.log(f.toString(), g.toString());

        const { a, b, ...rest } = { a: 1, b: 2, c: 3 };

        console.log(a);
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 7,
          column: 9,
          endLine: 7,
          endColumn: 17
        },
        {
          messageId: "forbidden",
          line: 8,
          column: 19,
          endLine: 8,
          endColumn: 26
        },
        {
          messageId: "forbidden",
          line: 9,
          column: 8,
          endLine: 9,
          endColumn: 15
        },
        {
          messageId: "forbidden",
          line: 16,
          column: 12,
          endLine: 16,
          endColumn: 13
        },
        {
          messageId: "forbidden",
          line: 16,
          column: 18,
          endLine: 16,
          endColumn: 22
        }
      ],
      output: stripIndent`
        // unused destructuring
        const instance = { property: 42 };
        const array = [54];

        console.log(instance, array);

        const { property } = instance;
        const { property: renamed } = instance;
        const [element] = array;

        function f({ name }: { name?: string }): void {}
        function g({ name: renamed }: { name?: string }): void {}

        console.log(f.toString(), g.toString());

        const { a, b, ...rest } = { a: 1, b: 2, c: 3 };

        console.log(a);
      `
    },
    {
      code: stripIndent`
        // unused enums
        enum WTF { TRUE, FALSE, FILE_NOT_FOUND }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 2,
          column: 6,
          endLine: 2,
          endColumn: 9
        }
      ],
      output: stripIndent`
        // unused enums
        enum WTF { TRUE, FALSE, FILE_NOT_FOUND }
      `
    },
    {
      code: stripIndent`
        // unused functions
        function f(): void {}
        const g = () => {};
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 2,
          column: 10,
          endLine: 2,
          endColumn: 11
        },
        {
          messageId: "forbidden",
          line: 3,
          column: 7,
          endLine: 3,
          endColumn: 8
        }
      ],
      output: stripIndent`
        // unused functions
        function f(): void {}
        const g = () => {};
      `
    },
    {
      code: stripIndent`
        // unused imports
        import { a } from "./letters";
        import { b } from "./letters";
        import { c, d } from "./letters";
        import { a as anise } from "./letters";
        import { b as basil } from "./letters";
        import {
          c as carrot,
          d as dill
        } from "./letters";
        import * as l from "./letters";
        import letters from "./letters";
        import L, { e } from "./letters";

        console.log(b, basil);
        console.log("the end");
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 2,
          column: 10,
          endLine: 2,
          endColumn: 11
        },
        {
          messageId: "forbidden",
          line: 4,
          column: 10,
          endLine: 4,
          endColumn: 11
        },
        {
          messageId: "forbidden",
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 14
        },
        {
          messageId: "forbidden",
          line: 5,
          column: 15,
          endLine: 5,
          endColumn: 20
        },
        {
          messageId: "forbidden",
          line: 8,
          column: 8,
          endLine: 8,
          endColumn: 14
        },
        {
          messageId: "forbidden",
          line: 9,
          column: 8,
          endLine: 9,
          endColumn: 12
        },
        {
          messageId: "forbidden",
          line: 11,
          column: 13,
          endLine: 11,
          endColumn: 14
        },
        {
          messageId: "forbidden",
          line: 12,
          column: 8,
          endLine: 12,
          endColumn: 15
        },
        {
          messageId: "forbidden",
          line: 13,
          column: 8,
          endLine: 13,
          endColumn: 9
        },
        {
          messageId: "forbidden",
          line: 13,
          column: 13,
          endLine: 13,
          endColumn: 14
        }
      ]
      // TODO:
      // output: stripIndent`
      //   // unused imports
      //   import { b } from "./letters";
      //   import { b as basil } from "./letters";

      //   console.log(b, basil);
      //   console.log("the end");
      // `
    },
    // TODO:
    // {
    //   code: stripIndent`
    //     // unused types
    //     interface SomeInterface {}
    //     type SomeType = {};
    //   `,
    //   errors: [
    //     {
    //       messageId: "forbidden",
    //       line: 2,
    //       column: 11,
    //       endLine: 2,
    //       endColumn: 24
    //     },
    //     {
    //       messageId: "forbidden",
    //       line: 3,
    //       column: 6,
    //       endLine: 3,
    //       endColumn: 14
    //     }
    //   ],
    //   output: stripIndent`
    //     // unused types
    //     interface SomeInterface {}
    //     type SomeType = {};
    //   `
    // },
    {
      code: stripIndent`
        // unused variables
        const a = "a";
        let b = "b";
        var c = "c";
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 2,
          column: 7,
          endLine: 2,
          endColumn: 8
        },
        {
          messageId: "forbidden",
          line: 3,
          column: 5,
          endLine: 3,
          endColumn: 6
        },
        {
          messageId: "forbidden",
          line: 4,
          column: 5,
          endLine: 4,
          endColumn: 6
        }
      ],
      output: stripIndent`
        // unused variables
        const a = "a";
        let b = "b";
        var c = "c";
      `
    }
  ]
});
