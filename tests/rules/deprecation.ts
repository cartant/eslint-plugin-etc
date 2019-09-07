/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/deprecation");
import { ruleTester } from "../utils";

const message = {
  messageId: "forbidden",
  data: {
    comment: "Don't use this"
  }
};

ruleTester({ comments: true, types: true }).run("deprecation", rule, {
  valid: [
    {
      code: stripIndent`
        interface SomeInterface {
          someProperty: string;
          someMethod(): void;
        };
        type SomeType = {
          someProperty: string;
          someMethod(): void;
        };
        class SomeClass {
          someProperty: string;
          get someGetter(): string { return ""; }
          set someSetter(value: string);
          someMethod() {}
          static someMethod() {}
        }
        enum SomeEnum {
          SomeMember = 1
        };
        const someVariable = {};
        function someFunction() {}
      `
    },
    {
      code: stripIndent`
        /** @deprecated Don't use this */
        function foo() {}
      `,
      options: [
        {
          "^foo$": false
        }
      ]
    }
  ],
  invalid: [
    {
      code: stripIndent`
        /** @deprecated Don't use this */
        interface SomeInterface {
          /** @deprecated Don't use this */
          someProperty: string;
          /** @deprecated Don't use this */
          someMethod(): void;
        };
      `,
      errors: [
        {
          ...message,
          line: 2,
          column: 11,
          endLine: 2,
          endColumn: 24
        },
        {
          ...message,
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 15
        },
        {
          ...message,
          line: 6,
          column: 3,
          endLine: 6,
          endColumn: 13
        }
      ]
    },
    {
      code: stripIndent`
        /** @deprecated Don't use this */
        type SomeType = {
          /** @deprecated Don't use this */
          someProperty: string;
          /** @deprecated Don't use this */
          someMethod(): void;
        };
      `,
      errors: [
        {
          ...message,
          line: 2,
          column: 6,
          endLine: 2,
          endColumn: 14
        },
        {
          ...message,
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 15
        },
        {
          ...message,
          line: 6,
          column: 3,
          endLine: 6,
          endColumn: 13
        }
      ]
    },
    {
      code: stripIndent`
        /** @deprecated Don't use this */
        class SomeClass {
          /** @deprecated Don't use this */
          someProperty: string;
          /** @deprecated Don't use this */
          get someGetter(): string { return ""; }
          /** @deprecated Don't use this */
          set someSetter(value: string);
          /** @deprecated Don't use this */
          someMethod() {}
          /** @deprecated Don't use this */
          static someMethod() {}
        }
      `,
      errors: [
        {
          ...message,
          line: 2,
          column: 7,
          endLine: 2,
          endColumn: 16
        },
        {
          ...message,
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 15
        },
        {
          ...message,
          line: 6,
          column: 7,
          endLine: 6,
          endColumn: 17
        },
        {
          ...message,
          line: 8,
          column: 7,
          endLine: 8,
          endColumn: 17
        },
        {
          ...message,
          line: 10,
          column: 3,
          endLine: 10,
          endColumn: 13
        },
        {
          ...message,
          line: 12,
          column: 10,
          endLine: 12,
          endColumn: 20
        }
      ]
    },
    {
      code: stripIndent`
        /** @deprecated Don't use this */
        enum SomeEnum {
          /** @deprecated Don't use this */
          SomeMember = 1
        };
      `,
      errors: [
        {
          ...message,
          line: 2,
          column: 6,
          endLine: 2,
          endColumn: 14
        },
        {
          ...message,
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 13
        }
      ]
    },
    {
      code: stripIndent`
        /** @deprecated Don't use this */
        const someVariable = {};
      `,
      errors: [
        {
          ...message,
          line: 2,
          column: 7,
          endLine: 2,
          endColumn: 19
        }
      ]
    },
    {
      code: stripIndent`
        /** @deprecated Don't use this */
        function someFunction() {}
      `,
      errors: [
        {
          ...message,
          line: 2,
          column: 10,
          endLine: 2,
          endColumn: 22
        }
      ]
    },
    {
      code: stripIndent`
        /** @deprecated Don't use this */
        function foo() {}
        /** @deprecated Don't use this */
        function bar() {}
      `,
      options: [
        {
          "^foo$": false
        }
      ],
      errors: [
        {
          ...message,
          line: 4,
          column: 10,
          endLine: 4,
          endColumn: 13
        }
      ]
    }
  ]
});
