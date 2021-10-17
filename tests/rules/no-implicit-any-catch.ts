/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/no-implicit-any-catch");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-implicit-any-catch", rule, {
  valid: [
    {
      code: stripIndent`
        // arrow; no parameter
        Promise.reject("Kaboom!").catch(
          () => console.error("Whoops!")
        );
      `,
    },
    {
      code: stripIndent`
        // non-arrow; no parameter
        Promise.reject("Kaboom!").catch(
          function () { console.error("Whoops!"); }
        );
      `,
    },
    {
      code: stripIndent`
        // arrow; explicit unknown; default option
        Promise.reject("Kaboom!").catch(
          (error: unknown) => console.error(error)
        );
      `,
    },
    {
      code: stripIndent`
        // non-arrow; explicit unknown; default option
        Promise.reject("Kaboom!").catch(
          function (error: unknown) { console.error(error); }
        );
      `,
    },
    {
      code: stripIndent`
        // arrow; explicit unknown; explicit option
        Promise.reject("Kaboom!").catch(
          (error: unknown) => console.error(error)
        );
      `,
      options: [{ allowExplicitAny: false }],
    },
    {
      code: stripIndent`
        // non-arrow; explicit unknown; explicit option
        Promise.reject("Kaboom!").catch(
          function (error: unknown) { console.error(error); }
        );
      `,
      options: [{ allowExplicitAny: false }],
    },
    {
      code: stripIndent`
        // arrow; explicit any
        Promise.reject("Kaboom!").catch(
          (error: any) => console.error(error)
        );
      `,
      options: [{ allowExplicitAny: true }],
    },
    {
      code: stripIndent`
        // non-arrow; explicit any
        Promise.reject("Kaboom!").catch(
          function (error: any) { console.error(error); }
        );
      `,
      options: [{ allowExplicitAny: true }],
    },
    {
      code: stripIndent`
        // then; arrow; no parameter
        Promise.reject("Kaboom!").then(
          () => {},
          () => console.error("Whoops!")
        );
      `,
    },
    {
      code: stripIndent`
        // then; non-arrow; no parameter
        Promise.reject("Kaboom!").then(
          function () {},
          function () { console.error("Whoops!"); }
        );
      `,
    },
    {
      code: stripIndent`
        // then; arrow; explicit unknown; default option
        Promise.reject("Kaboom!").then(
          () => {},
          (error: unknown) => console.error(error)
        );
      `,
    },
    {
      code: stripIndent`
        // then; non-arrow; explicit unknown; default option
        Promise.reject("Kaboom!").then(
          function () {},
          function (error: unknown) { console.error(error); }
        );
      `,
    },
    {
      code: stripIndent`
        // then; arrow; explicit unknown; explicit option
        Promise.reject("Kaboom!").then(
          () => {},
          (error: unknown) => console.error(error)
        );
      `,
      options: [{ allowExplicitAny: false }],
    },
    {
      code: stripIndent`
        // then; non-arrow; explicit unknown; explicit option
        Promise.reject("Kaboom!").then(
          function () {},
          function (error: unknown) { console.error(error); }
        );
      `,
      options: [{ allowExplicitAny: false }],
    },
    {
      code: stripIndent`
        // then; arrow; explicit any
        Promise.reject("Kaboom!").then(
          () => {},
          (error: any) => console.error(error)
        );
      `,
      options: [{ allowExplicitAny: true }],
    },
    {
      code: stripIndent`
        // then; non-arrow; explicit any
        Promise.reject("Kaboom!").then(
          function () {},
          function (error: any) { console.error(error); }
        );
      `,
      options: [{ allowExplicitAny: true }],
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // arrow; implicit any
        Promise.reject("Kaboom!").catch(
          (error) => console.error(error)
           ~~~~~ [implicitAny suggest]
        );
      `,
      {
        output: stripIndent`
          // arrow; implicit any
          Promise.reject("Kaboom!").catch(
            (error: unknown) => console.error(error)
          );
        `,
        suggestions: [
          {
            messageId: "suggestExplicitUnknown",
            output: stripIndent`
              // arrow; implicit any
              Promise.reject("Kaboom!").catch(
                (error: unknown) => console.error(error)
              );
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        // arrow; no parentheses; implicit any
        Promise.reject("Kaboom!").catch(
          error => console.error(error)
          ~~~~~ [implicitAny suggest]
        );
      `,
      {
        output: stripIndent`
          // arrow; no parentheses; implicit any
          Promise.reject("Kaboom!").catch(
            (error: unknown) => console.error(error)
          );
        `,
        suggestions: [
          {
            messageId: "suggestExplicitUnknown",
            output: stripIndent`
              // arrow; no parentheses; implicit any
              Promise.reject("Kaboom!").catch(
                (error: unknown) => console.error(error)
              );
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        // non-arrow; implicit any
        Promise.reject("Kaboom!").catch(
          function (error) { console.error(error); }
                    ~~~~~ [implicitAny suggest]
        );
      `,
      {
        output: stripIndent`
          // non-arrow; implicit any
          Promise.reject("Kaboom!").catch(
            function (error: unknown) { console.error(error); }
          );
        `,
        suggestions: [
          {
            messageId: "suggestExplicitUnknown",
            output: stripIndent`
              // non-arrow; implicit any
              Promise.reject("Kaboom!").catch(
                function (error: unknown) { console.error(error); }
              );
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        // arrow; explicit any; default option
        Promise.reject("Kaboom!").catch(
          (error: any) => console.error(error)
           ~~~~~~~~~~ [explicitAny suggest]
        );
      `,
      {
        output: stripIndent`
          // arrow; explicit any; default option
          Promise.reject("Kaboom!").catch(
            (error: unknown) => console.error(error)
          );
        `,
        suggestions: [
          {
            messageId: "suggestExplicitUnknown",
            output: stripIndent`
              // arrow; explicit any; default option
              Promise.reject("Kaboom!").catch(
                (error: unknown) => console.error(error)
              );
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        // non-arrow; explicit any; default option
        Promise.reject("Kaboom!").catch(
          function (error: any) { console.error(error); }
                    ~~~~~~~~~~ [explicitAny suggest]
        );
      `,
      {
        output: stripIndent`
          // non-arrow; explicit any; default option
          Promise.reject("Kaboom!").catch(
            function (error: unknown) { console.error(error); }
          );
        `,
        suggestions: [
          {
            messageId: "suggestExplicitUnknown",
            output: stripIndent`
              // non-arrow; explicit any; default option
              Promise.reject("Kaboom!").catch(
                function (error: unknown) { console.error(error); }
              );
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        // arrow; explicit any; explicit option
        Promise.reject("Kaboom!").catch(
          (error: any) => console.error(error)
           ~~~~~~~~~~ [explicitAny suggest]
        );
      `,
      {
        options: [{ allowExplicitAny: false }],
        output: stripIndent`
          // arrow; explicit any; explicit option
          Promise.reject("Kaboom!").catch(
            (error: unknown) => console.error(error)
          );
        `,
        suggestions: [
          {
            messageId: "suggestExplicitUnknown",
            output: stripIndent`
              // arrow; explicit any; explicit option
              Promise.reject("Kaboom!").catch(
                (error: unknown) => console.error(error)
              );
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        // non-arrow; explicit any; explicit option
        Promise.reject("Kaboom!").catch(
          function (error: any) { console.error(error); }
                    ~~~~~~~~~~ [explicitAny suggest]
        );
      `,
      {
        options: [{ allowExplicitAny: false }],
        output: stripIndent`
          // non-arrow; explicit any; explicit option
          Promise.reject("Kaboom!").catch(
            function (error: unknown) { console.error(error); }
          );
        `,
        suggestions: [
          {
            messageId: "suggestExplicitUnknown",
            output: stripIndent`
              // non-arrow; explicit any; explicit option
              Promise.reject("Kaboom!").catch(
                function (error: unknown) { console.error(error); }
              );
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        // arrow; narrowed
        Promise.reject("Kaboom!").catch(
          (error: string) => console.error(error)
           ~~~~~~~~~~~~~ [narrowed]
        );
      `
    ),
    fromFixture(
      stripIndent`
        // non-arrow; narrowed
        Promise.reject("Kaboom!").catch(
          function (error: string) { console.error(error); }
                    ~~~~~~~~~~~~~ [narrowed]
        );
      `
    ),
    fromFixture(
      stripIndent`
        // then; arrow; implicit any
        Promise.reject("Kaboom!").then(
          () => {},
          (error) => console.error(error)
           ~~~~~ [implicitAny suggest]
        );
      `,
      {
        output: stripIndent`
          // then; arrow; implicit any
          Promise.reject("Kaboom!").then(
            () => {},
            (error: unknown) => console.error(error)
          );
        `,
        suggestions: [
          {
            messageId: "suggestExplicitUnknown",
            output: stripIndent`
              // then; arrow; implicit any
              Promise.reject("Kaboom!").then(
                () => {},
                (error: unknown) => console.error(error)
              );
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        // then; arrow; no parentheses; implicit any
        Promise.reject("Kaboom!").then(
          () => {},
          error => console.error(error)
          ~~~~~ [implicitAny suggest]
        );
      `,
      {
        output: stripIndent`
          // then; arrow; no parentheses; implicit any
          Promise.reject("Kaboom!").then(
            () => {},
            (error: unknown) => console.error(error)
          );
        `,
        suggestions: [
          {
            messageId: "suggestExplicitUnknown",
            output: stripIndent`
              // then; arrow; no parentheses; implicit any
              Promise.reject("Kaboom!").then(
                () => {},
                (error: unknown) => console.error(error)
              );
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        // then; non-arrow; implicit any
        Promise.reject("Kaboom!").then(
          function () {},
          function (error) { console.error(error); }
                    ~~~~~ [implicitAny suggest]
        );
      `,
      {
        output: stripIndent`
          // then; non-arrow; implicit any
          Promise.reject("Kaboom!").then(
            function () {},
            function (error: unknown) { console.error(error); }
          );
        `,
        suggestions: [
          {
            messageId: "suggestExplicitUnknown",
            output: stripIndent`
              // then; non-arrow; implicit any
              Promise.reject("Kaboom!").then(
                function () {},
                function (error: unknown) { console.error(error); }
              );
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        // then; arrow; explicit any; default option
        Promise.reject("Kaboom!").then(
          () => {},
          (error: any) => console.error(error)
           ~~~~~~~~~~ [explicitAny suggest]
        );
      `,
      {
        output: stripIndent`
          // then; arrow; explicit any; default option
          Promise.reject("Kaboom!").then(
            () => {},
            (error: unknown) => console.error(error)
          );
        `,
        suggestions: [
          {
            messageId: "suggestExplicitUnknown",
            output: stripIndent`
              // then; arrow; explicit any; default option
              Promise.reject("Kaboom!").then(
                () => {},
                (error: unknown) => console.error(error)
              );
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        // then; non-arrow; explicit any; default option
        Promise.reject("Kaboom!").then(
          function () {},
          function (error: any) { console.error(error); }
                    ~~~~~~~~~~ [explicitAny suggest]
        );
      `,
      {
        output: stripIndent`
          // then; non-arrow; explicit any; default option
          Promise.reject("Kaboom!").then(
            function () {},
            function (error: unknown) { console.error(error); }
          );
        `,
        suggestions: [
          {
            messageId: "suggestExplicitUnknown",
            output: stripIndent`
              // then; non-arrow; explicit any; default option
              Promise.reject("Kaboom!").then(
                function () {},
                function (error: unknown) { console.error(error); }
              );
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        // then; arrow; explicit any; explicit option
        Promise.reject("Kaboom!").then(
          () => {},
          (error: any) => console.error(error)
           ~~~~~~~~~~ [explicitAny suggest]
        );
      `,
      {
        options: [{ allowExplicitAny: false }],
        output: stripIndent`
          // then; arrow; explicit any; explicit option
          Promise.reject("Kaboom!").then(
            () => {},
            (error: unknown) => console.error(error)
          );
        `,
        suggestions: [
          {
            messageId: "suggestExplicitUnknown",
            output: stripIndent`
              // then; arrow; explicit any; explicit option
              Promise.reject("Kaboom!").then(
                () => {},
                (error: unknown) => console.error(error)
              );
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        // then; non-arrow; explicit any; explicit option
        Promise.reject("Kaboom!").then(
          function () {},
          function (error: any) { console.error(error); }
                    ~~~~~~~~~~ [explicitAny suggest]
        );
      `,
      {
        options: [{ allowExplicitAny: false }],
        output: stripIndent`
          // then; non-arrow; explicit any; explicit option
          Promise.reject("Kaboom!").then(
            function () {},
            function (error: unknown) { console.error(error); }
          );
        `,
        suggestions: [
          {
            messageId: "suggestExplicitUnknown",
            output: stripIndent`
              // then; non-arrow; explicit any; explicit option
              Promise.reject("Kaboom!").then(
                function () {},
                function (error: unknown) { console.error(error); }
              );
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        // then; arrow; narrowed
        Promise.reject("Kaboom!").then(
          () => {},
          (error: string) => console.error(error)
           ~~~~~~~~~~~~~ [narrowed]
        );
      `
    ),
    fromFixture(
      stripIndent`
        // then; non-arrow; narrowed
        Promise.reject("Kaboom!").then(
          function () {},
          function (error: string) { console.error(error); }
                    ~~~~~~~~~~~~~ [narrowed]
        );
      `
    ),
  ],
});
