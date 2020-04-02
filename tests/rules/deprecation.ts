/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/deprecation");
import { ruleTester } from "../utils";

const message = (name: string) => ({
  messageId: "forbidden",
  data: {
    comment: "Don't use this",
    name,
  },
});

ruleTester({ comments: true, types: true }).run("deprecation", rule, {
  valid: [
    {
      code: stripIndent`
        // Not deprecated interface
        import { NotDeprecatedInterface } from "./modules/deprecation";
        let a: NotDeprecatedInterface;
      `,
    },
    {
      code: stripIndent`
        // Not deprecated type
        import { NotDeprecatedType } from "./modules/deprecation";
        let a: NotDeprecatedType;
      `,
    },
    {
      code: stripIndent`
        // Not deprecated class
        import { NotDeprecatedClass } from "./modules/deprecation";
        let a: NotDeprecatedClass;
      `,
    },
    {
      code: stripIndent`
        // Not deprecated class
        import { NotDeprecatedClass } from "./modules/deprecation";
        let a = new NotDeprecatedClass();
      `,
    },
    {
      code: stripIndent`
        // Not deprecated enum
        import { NotDeprecatedEnum } from "./modules/deprecation";
        let a: NotDeprecatedEnum;
      `,
    },
    {
      code: stripIndent`
        // Not deprecated variable
        import { notDeprecatedVariable } from "./modules/deprecation";
        let a = notDeprecatedVariable;
      `,
    },
    {
      code: stripIndent`
        // Not deprecated function
        import { notDeprecatedFunction } from "./modules/deprecation";
        notDeprecatedFunction();
      `,
    },
    {
      code: stripIndent`
        // Some not deprecated interface
        import { SomeDeprecatedInterface } from "./modules/deprecation";
        let a: SomeDeprecatedInterface;
        console.log(a.notDeprecatedProperty);
        a.notDeprecatedMethod();
      `,
    },
    {
      code: stripIndent`
        // Some not deprecated type
        import { SomeDeprecatedType } from "./modules/deprecation";
        let a: SomeDeprecatedType;
        console.log(a.notDeprecatedProperty);
        a.notDeprecatedMethod();
      `,
    },
    {
      code: stripIndent`
        // Some not deprecated class
        import { SomeDeprecatedClass } from "./modules/deprecation";
        SomeDeprecatedClass.notDeprecatedStaticMethod();
        let a: SomeDeprecatedClass;
        console.log(a.notDeprecatedProperty);
        console.log(a.notDeprecatedGetter);
        a.notDeprecatedSetter = "42";
        a.notDeprecatedMethod();
      `,
    },
    {
      code: stripIndent`
        // Some not deprecated enum
        import { SomeDeprecatedEnum } from "./modules/deprecation";
        let a: SomeDeprecatedEnum;
        a = SomeDeprecatedEnum.NotDeprecatedMember;
      `,
    },
    {
      code: stripIndent`
        // Some signatures not deprecated class
        import { DeprecatedSignatureClass } from "./modules/deprecation";
        DeprecatedSignatureClass.deprecatedSignatureStaticMethod(42);
        let a: DeprecatedSignatureClass;
        a.deprecatedSignatureMethod(42);
      `,
    },
    {
      code: stripIndent`
        // Some signatures not deprecated function
        import { deprecatedSignatureFunction } from "./modules/deprecation";
        deprecatedSignatureFunction(42);
      `,
    },
    {
      code: stripIndent`
        // Not deprecated constructor
        import { DeprecatedConstructorSignatureClass } from "./modules/deprecation";
        let a = new DeprecatedConstructorSignatureClass(42);
      `,
    },
    {
      code: stripIndent`
        // Ignored name
        import { DeprecatedInterface } from "./modules/deprecation";
        let a: DeprecatedInterface;
      `,
      options: [
        {
          ignored: {
            "^DeprecatedInterface$": "name",
          },
        },
      ],
    },
    {
      code: stripIndent`
        // Ignored path
        import { DeprecatedInterface } from "./modules/deprecation";
        let a: DeprecatedInterface;
      `,
      options: [
        {
          ignored: {
            "modules/deprecation": "path",
          },
        },
      ],
    },
  ],
  invalid: [
    {
      code: stripIndent`
        // Deprecated interface
        import { DeprecatedInterface } from "./modules/deprecation";
        let a: DeprecatedInterface;
      `,
      errors: [
        {
          ...message("DeprecatedInterface"),
          line: 3,
          column: 8,
          endLine: 3,
          endColumn: 27,
        },
      ],
    },
    {
      code: stripIndent`
        // Multiple uses
        import { DeprecatedInterface } from "./modules/deprecation";
        let a: DeprecatedInterface;
        let b: DeprecatedInterface;
      `,
      errors: [
        {
          ...message("DeprecatedInterface"),
          line: 3,
          column: 8,
          endLine: 3,
          endColumn: 27,
        },
        {
          ...message("DeprecatedInterface"),
          line: 4,
          column: 8,
          endLine: 4,
          endColumn: 27,
        },
      ],
    },
    {
      code: stripIndent`
        // Deprecated type
        import { DeprecatedType } from "./modules/deprecation";
        let a: DeprecatedType;
      `,
      errors: [
        {
          ...message("DeprecatedType"),
          line: 3,
          column: 8,
          endLine: 3,
          endColumn: 22,
        },
      ],
    },
    {
      code: stripIndent`
        // Deprecated class
        import { DeprecatedClass } from "./modules/deprecation";
        let a: DeprecatedClass;
      `,
      errors: [
        {
          ...message("DeprecatedClass"),
          line: 3,
          column: 8,
          endLine: 3,
          endColumn: 23,
        },
      ],
    },
    {
      code: stripIndent`
        // Deprecated class
        import { DeprecatedClass } from "./modules/deprecation";
        let a = new DeprecatedClass();
      `,
      errors: [
        {
          ...message("DeprecatedClass"),
          line: 3,
          column: 13,
          endLine: 3,
          endColumn: 28,
        },
      ],
    },
    {
      code: stripIndent`
        // Deprecated enum
        import { DeprecatedEnum } from "./modules/deprecation";
        let a: DeprecatedEnum;
      `,
      errors: [
        {
          ...message("DeprecatedEnum"),
          line: 3,
          column: 8,
          endLine: 3,
          endColumn: 22,
        },
      ],
    },
    {
      code: stripIndent`
        // Deprecated variable
        import { deprecatedVariable } from "./modules/deprecation";
        let a = deprecatedVariable;
      `,
      errors: [
        {
          ...message("deprecatedVariable"),
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 27,
        },
      ],
    },
    {
      code: stripIndent`
        // Deprecated function
        import { deprecatedFunction } from "./modules/deprecation";
        deprecatedFunction();
      `,
      errors: [
        {
          ...message("deprecatedFunction"),
          line: 3,
          column: 1,
          endLine: 3,
          endColumn: 19,
        },
      ],
    },
    {
      code: stripIndent`
        // Some deprecated interface
        import { SomeDeprecatedInterface } from "./modules/deprecation";
        let a: SomeDeprecatedInterface;
        console.log(a.deprecatedProperty);
        a.deprecatedMethod();
      `,
      errors: [
        {
          ...message("deprecatedProperty"),
          line: 4,
          column: 15,
          endLine: 4,
          endColumn: 33,
        },
        {
          ...message("deprecatedMethod"),
          line: 5,
          column: 3,
          endLine: 5,
          endColumn: 19,
        },
      ],
    },
    {
      code: stripIndent`
        // Some deprecated type
        import { SomeDeprecatedType } from "./modules/deprecation";
        let a: SomeDeprecatedType;
        console.log(a.deprecatedProperty);
        a.deprecatedMethod();
      `,
      errors: [
        {
          ...message("deprecatedProperty"),
          line: 4,
          column: 15,
          endLine: 4,
          endColumn: 33,
        },
        {
          ...message("deprecatedMethod"),
          line: 5,
          column: 3,
          endLine: 5,
          endColumn: 19,
        },
      ],
    },
    {
      code: stripIndent`
        // Some deprecated class
        import { SomeDeprecatedClass } from "./modules/deprecation";
        SomeDeprecatedClass.deprecatedStaticMethod();
        let a: SomeDeprecatedClass;
        console.log(a.deprecatedProperty);
        console.log(a.deprecatedGetter);
        a.deprecatedSetter = "42";
        a.deprecatedMethod();
      `,
      errors: [
        {
          ...message("deprecatedStaticMethod"),
          line: 3,
          column: 21,
          endLine: 3,
          endColumn: 43,
        },
        {
          ...message("deprecatedProperty"),
          line: 5,
          column: 15,
          endLine: 5,
          endColumn: 33,
        },
        {
          ...message("deprecatedGetter"),
          line: 6,
          column: 15,
          endLine: 6,
          endColumn: 31,
        },
        {
          ...message("deprecatedSetter"),
          line: 7,
          column: 3,
          endLine: 7,
          endColumn: 19,
        },
        {
          ...message("deprecatedMethod"),
          line: 8,
          column: 3,
          endLine: 8,
          endColumn: 19,
        },
      ],
    },
    {
      code: stripIndent`
        // Some deprecated enum
        import { SomeDeprecatedEnum } from "./modules/deprecation";
        let a: SomeDeprecatedEnum;
        a = SomeDeprecatedEnum.DeprecatedMember;
      `,
      errors: [
        {
          ...message("DeprecatedMember"),
          line: 4,
          column: 24,
          endLine: 4,
          endColumn: 40,
        },
      ],
    },
    {
      code: stripIndent`
        // Some signatures deprecated class
        import { DeprecatedSignatureClass } from "./modules/deprecation";
        DeprecatedSignatureClass.deprecatedSignatureStaticMethod("42");
        let a: DeprecatedSignatureClass;
        a.deprecatedSignatureMethod("42");
      `,
      errors: [
        {
          ...message("deprecatedSignatureStaticMethod"),
          line: 3,
          column: 26,
          endLine: 3,
          endColumn: 57,
        },
        {
          ...message("deprecatedSignatureMethod"),
          line: 5,
          column: 3,
          endLine: 5,
          endColumn: 28,
        },
      ],
    },
    {
      code: stripIndent`
        // Some signatures deprecated function
        import { deprecatedSignatureFunction } from "./modules/deprecation";
        deprecatedSignatureFunction("42");
      `,
      errors: [
        {
          ...message("deprecatedSignatureFunction"),
          line: 3,
          column: 1,
          endLine: 3,
          endColumn: 28,
        },
      ],
    },
    {
      code: stripIndent`
        // Deprecated constructor
        import { DeprecatedConstructorSignatureClass } from "./modules/deprecation";
        let a = new DeprecatedConstructorSignatureClass("42");
      `,
      errors: [
        {
          ...message("DeprecatedConstructorSignatureClass"),
          line: 3,
          column: 13,
          endLine: 3,
          endColumn: 48,
        },
      ],
    },
    {
      code: stripIndent`
        // Not ignored name
        import { DeprecatedInterface } from "./modules/deprecation";
        let a: DeprecatedInterface;
      `,
      errors: [
        {
          ...message("DeprecatedInterface"),
          line: 3,
          column: 8,
          endLine: 3,
          endColumn: 27,
        },
      ],
      options: [
        {
          ignored: {
            "^Foo$": "name",
          },
        },
      ],
    },
    {
      code: stripIndent`
        // Not ignored path
        import { DeprecatedInterface } from "./modules/deprecation";
        let a: DeprecatedInterface;
      `,
      errors: [
        {
          ...message("DeprecatedInterface"),
          line: 3,
          column: 8,
          endLine: 3,
          endColumn: 27,
        },
      ],
      options: [
        {
          ignored: {
            "modules/foo": "path",
          },
        },
      ],
    },
  ],
});
