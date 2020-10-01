/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/no-internal");
import { ruleTester } from "../utils";

ruleTester({ comments: true, types: true }).run("no-internal", rule, {
  valid: [
    {
      code: stripIndent`
        // Not internal interface
        import { NotInternalInterface } from "./modules/internal";
        let a: NotInternalInterface;
      `,
    },
    {
      code: stripIndent`
        // Not internal type
        import { NotInternalType } from "./modules/internal";
        let a: NotInternalType;
      `,
    },
    {
      code: stripIndent`
        // Not internal class
        import { NotInternalClass } from "./modules/internal";
        let a: NotInternalClass;
      `,
    },
    {
      code: stripIndent`
        // Not internal class
        import { NotInternalClass } from "./modules/internal";
        let a = new NotInternalClass();
      `,
    },
    {
      code: stripIndent`
        // Not internal enum
        import { NotInternalEnum } from "./modules/internal";
        let a: NotInternalEnum;
      `,
    },
    {
      code: stripIndent`
        // Not internal variable
        import { notInternalVariable } from "./modules/internal";
        let a = notInternalVariable;
      `,
    },
    {
      code: stripIndent`
        // Not internal function
        import { notInternalFunction } from "./modules/internal";
        notInternalFunction();
      `,
    },
    {
      code: stripIndent`
        // Some not internal interface
        import { SomeInternalInterface } from "./modules/internal";
        let a: SomeInternalInterface;
        console.log(a.notInternalProperty);
        a.notInternalMethod();
      `,
    },
    {
      code: stripIndent`
        // Some not internal type
        import { SomeInternalType } from "./modules/internal";
        let a: SomeInternalType;
        console.log(a.notInternalProperty);
        a.notInternalMethod();
      `,
    },
    {
      code: stripIndent`
        // Some not internal class
        import { SomeInternalClass } from "./modules/internal";
        SomeInternalClass.notInternalStaticMethod();
        let a: SomeInternalClass;
        console.log(a.notInternalProperty);
        console.log(a.notInternalGetter);
        a.notInternalSetter = "42";
        a.notInternalMethod();
      `,
    },
    {
      code: stripIndent`
        // Some not internal enum
        import { SomeInternalEnum } from "./modules/internal";
        let a: SomeInternalEnum;
        a = SomeInternalEnum.NotInternalMember;
      `,
    },
    {
      code: stripIndent`
        // Some signatures not internal class
        import { InternalSignatureClass } from "./modules/internal";
        InternalSignatureClass.internalSignatureStaticMethod(42);
        let a: InternalSignatureClass;
        a.internalSignatureMethod(42);
      `,
    },
    {
      code: stripIndent`
        // Some signatures not internal function
        import { internalSignatureFunction } from "./modules/internal";
        internalSignatureFunction(42);
      `,
    },
    {
      code: stripIndent`
        // Not internal constructor
        import { InternalConstructorSignatureClass } from "./modules/internal";
        let a = new InternalConstructorSignatureClass(42);
      `,
    },
    {
      code: stripIndent`
        // Ignored name
        import { InternalInterface } from "./modules/internal";
        let a: InternalInterface;
      `,
      options: [
        {
          ignored: {
            "^InternalInterface$": "name",
          },
        },
      ],
    },
    {
      code: stripIndent`
        // Ignored path
        import { InternalInterface } from "./modules/internal";
        let a: InternalInterface;
      `,
      options: [
        {
          ignored: {
            "modules/internal": "path",
          },
        },
      ],
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // Internal interface
        import { InternalInterface } from "./modules/internal";
        let a: InternalInterface;
               ~~~~~~~~~~~~~~~~~ [forbidden { "name": "InternalInterface" }]
      `
    ),
    fromFixture(
      stripIndent`
        // Multiple uses
        import { InternalInterface } from "./modules/internal";
        let a: InternalInterface;
               ~~~~~~~~~~~~~~~~~ [forbidden { "name": "InternalInterface" }]
        let b: InternalInterface;
               ~~~~~~~~~~~~~~~~~ [forbidden { "name": "InternalInterface" }]
      `
    ),
    fromFixture(
      stripIndent`
        // Internal type
        import { InternalType } from "./modules/internal";
        let a: InternalType;
               ~~~~~~~~~~~~ [forbidden { "name": "InternalType" }]
      `
    ),
    fromFixture(
      stripIndent`
        // Internal class
        import { InternalClass } from "./modules/internal";
        let a: InternalClass;
               ~~~~~~~~~~~~~ [forbidden { "name": "InternalClass" }]
      `
    ),
    fromFixture(
      stripIndent`
        // Internal class with new
        import { InternalClass } from "./modules/internal";
        let a = new InternalClass();
                    ~~~~~~~~~~~~~ [forbidden { "name": "InternalClass" }]
      `
    ),
    fromFixture(
      stripIndent`
        // Internal enum
        import { InternalEnum } from "./modules/internal";
        let a: InternalEnum;
               ~~~~~~~~~~~~ [forbidden { "name": "InternalEnum" }]
      `
    ),
    fromFixture(
      stripIndent`
        // Internal variable
        import { internalVariable } from "./modules/internal";
        let a = internalVariable;
                ~~~~~~~~~~~~~~~~ [forbidden { "name": "internalVariable" }]
      `
    ),
    fromFixture(
      stripIndent`
        // Internal function
        import { internalFunction } from "./modules/internal";
        internalFunction();
        ~~~~~~~~~~~~~~~~ [forbidden { "name": "internalFunction" }]
      `
    ),
    fromFixture(
      stripIndent`
        // Some internal interface
        import { SomeInternalInterface } from "./modules/internal";
        let a: SomeInternalInterface;
        console.log(a.internalProperty);
                      ~~~~~~~~~~~~~~~~ [forbidden { "name": "internalProperty" }]
        a.internalMethod();
          ~~~~~~~~~~~~~~ [forbidden { "name": "internalMethod" }]
      `
    ),
    fromFixture(
      stripIndent`
        // Some internal type
        import { SomeInternalType } from "./modules/internal";
        let a: SomeInternalType;
        console.log(a.internalProperty);
                      ~~~~~~~~~~~~~~~~ [forbidden { "name": "internalProperty" }]
        a.internalMethod();
          ~~~~~~~~~~~~~~ [forbidden { "name": "internalMethod" }]
      `
    ),
    fromFixture(
      stripIndent`
        // Some internal class
        import { SomeInternalClass } from "./modules/internal";
        SomeInternalClass.internalStaticMethod();
                          ~~~~~~~~~~~~~~~~~~~~ [forbidden { "name": "internalStaticMethod" }]
        let a: SomeInternalClass;
        console.log(a.internalProperty);
                      ~~~~~~~~~~~~~~~~ [forbidden { "name": "internalProperty" }]
        console.log(a.internalGetter);
                      ~~~~~~~~~~~~~~ [forbidden { "name": "internalGetter" }]
        a.internalSetter = "42";
          ~~~~~~~~~~~~~~ [forbidden { "name": "internalSetter" }]
        a.internalMethod();
          ~~~~~~~~~~~~~~ [forbidden { "name": "internalMethod" }]
      `
    ),
    fromFixture(
      stripIndent`
        // Some internal enum
        import { SomeInternalEnum } from "./modules/internal";
        let a: SomeInternalEnum;
        a = SomeInternalEnum.InternalMember;
                             ~~~~~~~~~~~~~~ [forbidden { "name": "InternalMember" }]
      `
    ),
    fromFixture(
      stripIndent`
        // Some signatures internal class
        import { InternalSignatureClass } from "./modules/internal";
        InternalSignatureClass.internalSignatureStaticMethod("42");
                               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden { "name": "internalSignatureStaticMethod" }]
        let a: InternalSignatureClass;
        a.internalSignatureMethod("42");
          ~~~~~~~~~~~~~~~~~~~~~~~ [forbidden { "name": "internalSignatureMethod" }]
      `
    ),
    fromFixture(
      stripIndent`
        // Some signatures internal function
        import { internalSignatureFunction } from "./modules/internal";
        internalSignatureFunction("42");
        ~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden { "name": "internalSignatureFunction" }]
      `
    ),
    fromFixture(
      stripIndent`
        // Internal constructor
        import { InternalConstructorSignatureClass } from "./modules/internal";
        let a = new InternalConstructorSignatureClass("42");
                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden { "name": "InternalConstructorSignatureClass" }]
      `
    ),
    fromFixture(
      stripIndent`
        // Not ignored name
        import { InternalInterface } from "./modules/internal";
        let a: InternalInterface;
               ~~~~~~~~~~~~~~~~~ [forbidden { "name": "InternalInterface" }]
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
        import { InternalInterface } from "./modules/internal";
        let a: InternalInterface;
               ~~~~~~~~~~~~~~~~~ [forbidden { "name": "InternalInterface" }]
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
