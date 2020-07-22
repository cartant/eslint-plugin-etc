/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/deprecation");
import { ruleTester } from "../utils";

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
    fromFixture(
      stripIndent`
        // Deprecated interface
        import { DeprecatedInterface } from "./modules/deprecation";
        let a: DeprecatedInterface;
               ~~~~~~~~~~~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // Multiple uses
        import { DeprecatedInterface } from "./modules/deprecation";
        let a: DeprecatedInterface;
               ~~~~~~~~~~~~~~~~~~~ [forbidden]
        let b: DeprecatedInterface;
               ~~~~~~~~~~~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // Deprecated type
        import { DeprecatedType } from "./modules/deprecation";
        let a: DeprecatedType;
               ~~~~~~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // Deprecated class
        import { DeprecatedClass } from "./modules/deprecation";
        let a: DeprecatedClass;
               ~~~~~~~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // Deprecated class with new
        import { DeprecatedClass } from "./modules/deprecation";
        let a = new DeprecatedClass();
                    ~~~~~~~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // Deprecated enum
        import { DeprecatedEnum } from "./modules/deprecation";
        let a: DeprecatedEnum;
               ~~~~~~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // Deprecated variable
        import { deprecatedVariable } from "./modules/deprecation";
        let a = deprecatedVariable;
                ~~~~~~~~~~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // Deprecated function
        import { deprecatedFunction } from "./modules/deprecation";
        deprecatedFunction();
        ~~~~~~~~~~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // Some deprecated interface
        import { SomeDeprecatedInterface } from "./modules/deprecation";
        let a: SomeDeprecatedInterface;
        console.log(a.deprecatedProperty);
                      ~~~~~~~~~~~~~~~~~~ [forbidden]
        a.deprecatedMethod();
          ~~~~~~~~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // Some deprecated type
        import { SomeDeprecatedType } from "./modules/deprecation";
        let a: SomeDeprecatedType;
        console.log(a.deprecatedProperty);
                      ~~~~~~~~~~~~~~~~~~ [forbidden]
        a.deprecatedMethod();
          ~~~~~~~~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // Some deprecated class
        import { SomeDeprecatedClass } from "./modules/deprecation";
        SomeDeprecatedClass.deprecatedStaticMethod();
                            ~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
        let a: SomeDeprecatedClass;
        console.log(a.deprecatedProperty);
                      ~~~~~~~~~~~~~~~~~~ [forbidden]
        console.log(a.deprecatedGetter);
                      ~~~~~~~~~~~~~~~~ [forbidden]
        a.deprecatedSetter = "42";
          ~~~~~~~~~~~~~~~~ [forbidden]
        a.deprecatedMethod();
          ~~~~~~~~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // Some deprecated enum
        import { SomeDeprecatedEnum } from "./modules/deprecation";
        let a: SomeDeprecatedEnum;
        a = SomeDeprecatedEnum.DeprecatedMember;
                               ~~~~~~~~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // Some signatures deprecated class
        import { DeprecatedSignatureClass } from "./modules/deprecation";
        DeprecatedSignatureClass.deprecatedSignatureStaticMethod("42");
                                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
        let a: DeprecatedSignatureClass;
        a.deprecatedSignatureMethod("42");
          ~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // Some signatures deprecated function
        import { deprecatedSignatureFunction } from "./modules/deprecation";
        deprecatedSignatureFunction("42");
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // Deprecated constructor
        import { DeprecatedConstructorSignatureClass } from "./modules/deprecation";
        let a = new DeprecatedConstructorSignatureClass("42");
                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // Not ignored name
        import { DeprecatedInterface } from "./modules/deprecation";
        let a: DeprecatedInterface;
               ~~~~~~~~~~~~~~~~~~~ [forbidden]
      `,
      {
        options: [
          {
            ignored: {
              "^Foo$": "name",
            },
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        // Not ignored path
        import { DeprecatedInterface } from "./modules/deprecation";
        let a: DeprecatedInterface;
               ~~~~~~~~~~~~~~~~~~~ [forbidden]
      `,
      {
        options: [
          {
            ignored: {
              "modules/foo": "path",
            },
          },
        ],
      }
    ),
  ],
});
