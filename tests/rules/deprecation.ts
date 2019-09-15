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
        // no deprecation
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
        // ignored deprecation
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
        // interface deprecation
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
          line: 3,
          column: 11,
          endLine: 3,
          endColumn: 24
        },
        {
          ...message,
          line: 5,
          column: 3,
          endLine: 5,
          endColumn: 15
        },
        {
          ...message,
          line: 7,
          column: 3,
          endLine: 7,
          endColumn: 13
        }
      ]
    },
    {
      code: stripIndent`
        // type deprecation
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
          line: 3,
          column: 6,
          endLine: 3,
          endColumn: 14
        },
        {
          ...message,
          line: 5,
          column: 3,
          endLine: 5,
          endColumn: 15
        },
        {
          ...message,
          line: 7,
          column: 3,
          endLine: 7,
          endColumn: 13
        }
      ]
    },
    {
      code: stripIndent`
        // class deprecation
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
          line: 3,
          column: 7,
          endLine: 3,
          endColumn: 16
        },
        {
          ...message,
          line: 5,
          column: 3,
          endLine: 5,
          endColumn: 15
        },
        {
          ...message,
          line: 7,
          column: 7,
          endLine: 7,
          endColumn: 17
        },
        {
          ...message,
          line: 9,
          column: 7,
          endLine: 9,
          endColumn: 17
        },
        {
          ...message,
          line: 11,
          column: 3,
          endLine: 11,
          endColumn: 13
        },
        {
          ...message,
          line: 13,
          column: 10,
          endLine: 13,
          endColumn: 20
        }
      ]
    },
    {
      code: stripIndent`
        // enum deprecation
        /** @deprecated Don't use this */
        enum SomeEnum {
          /** @deprecated Don't use this */
          SomeMember = 1
        };
      `,
      errors: [
        {
          ...message,
          line: 3,
          column: 6,
          endLine: 3,
          endColumn: 14
        },
        {
          ...message,
          line: 5,
          column: 3,
          endLine: 5,
          endColumn: 13
        }
      ]
    },
    {
      code: stripIndent`
        // variable deprecation
        /** @deprecated Don't use this */
        const someVariable = {};
      `,
      errors: [
        {
          ...message,
          line: 3,
          column: 7,
          endLine: 3,
          endColumn: 19
        }
      ]
    },
    {
      code: stripIndent`
        // function deprecation
        /** @deprecated Don't use this */
        function someFunction() {}
      `,
      errors: [
        {
          ...message,
          line: 3,
          column: 10,
          endLine: 3,
          endColumn: 22
        }
      ]
    },
    {
      code: stripIndent`
        // not ignored deprecation
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
          line: 5,
          column: 10,
          endLine: 5,
          endColumn: 13
        }
      ]
    }
  ]
});
