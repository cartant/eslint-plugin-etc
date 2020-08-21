/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
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
      `,
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
      `,
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
            jsx: true,
          },
        },
      ],
    },
    {
      code: stripIndent`
        // used classes
        class Person {}

        console.log(new Person());
      `,
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

        console.log(rest);
      `,
    },
    {
      code: stripIndent`
        // used enums
        enum WTF { TRUE, FALSE, FILE_NOT_FOUND }

        console.log(WTF.FILE_NOT_FOUND);
      `,
    },
    {
      code: stripIndent`
        // used const enums
        const enum WTF { TRUE, FALSE, FILE_NOT_FOUND }

        console.log(WTF.FILE_NOT_FOUND);
      `,
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
      `,
    },
    {
      code: stripIndent`
        // used functions
        function f(): void {}
        const g = () => {};

        console.log(f.toString(), g.toString());
      `,
    },
    {
      code: stripIndent`
        // used imports object calculated
        import { a, b, c } from "./letters";

        const d = { [a]: a, [b]: "b", ["c"]: c };
        console.log(d);
      `,
    },
    {
      code: stripIndent`
        // used imports object properties
        import { a, b, c } from "./letters";

        const d = { a: a, b: b, c: c };
        console.log(d);
      `,
    },
    {
      code: stripIndent`
        // used imports object shorthand
        import { a, b, c } from "./letters";

        const d = { a, b, c };
        console.log(d);
      `,
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
      `,
    },
    {
      code: stripIndent`
        // used types
        interface SomeInterface {}
        type SomeType = {};

        declare const a: SomeInterface;
        declare const b: SomeType;

        console.log(a, b);
      `,
    },
    {
      code: stripIndent`
        // used base class
        import { Base } from "./base";

        export class Derived extends Base {}
      `,
    },
    {
      code: stripIndent`
        // used base interface
        import { Base } from "./base";

        export interface Derived extends Base {}
      `,
    },
    {
      code: stripIndent`
        // exported types
        export interface SomeInterface {}
        export type SomeType = {};
      `,
    },
    {
      code: stripIndent`
        // used type imports
        import { Thing } from "./thing";

        const t: Thing | null = null;
        console.log(t);
      `,
    },
    {
      code: stripIndent`
        // used qualified type imports
        import { Thing } from "./thing";

        const t: Thing.Name | null = null;
        console.log(t);
      `,
    },
    {
      code: stripIndent`
        // used variables object calculated
        const a = "a";
        let b = "b";
        var c = "c";

        const d = { [a]: a, [b]: "b", ["c"]: c };
        console.log(d);
      `,
    },
    {
      code: stripIndent`
        // used variables object properties
        const a = "a";
        let b = "b";
        var c = "c";

        const d = { a: a, b: b, c: c };
        console.log(d);
      `,
    },
    {
      code: stripIndent`
        // used variables object shorthand
        const a = "a";
        let b = "b";
        var c = "c";

        const d = { a, b, c };
        console.log(d);
      `,
    },
    {
      code: stripIndent`
        // used variables
        const a = "a";
        let b = "b";
        var c = "c";

        console.log(a, b, c);
      `,
    },
    {
      code: stripIndent`
        // used JSX components
        import React from "react";
        import { Thing } from "./thing";

        export const OpenCloseThing = ({ children, ...props }) => <Thing {...props}>{children}</Thing>;
        export const SelfCloseThing = props => <Thing {...props}/>;
      `,
      options: [
        {
          ignored: {
            React: true,
          },
        },
      ],
    },
    {
      code: stripIndent`
        // used JSX namespace components
        import React from "react";
        import * as Icons from "./icons";

        export const App = () => {
          return <div>
            <Icons.One/>
            <Icons.Two/>
          </div>
        };
      `,
      options: [
        {
          ignored: {
            React: true,
          },
        },
      ],
    },
    {
      code: stripIndent`
        // used within class scope
        let draging = false;
        let popupVisible = false;

        export class DragAndDropStore {
          isDraging = () => draging;
          isPopupVisible = () => popupVisible;
        }
      `,
    },
    {
      code: stripIndent`
        // https://github.com/cartant/tslint-etc/issues/3
        export const h = hoisted();
        function hoisted(): number { return 42; }
      `,
    },
    {
      code: stripIndent`
        // https://github.com/cartant/tslint-etc/issues/6
        import { other } from "./other";
        export { other };

        const another = "another";
        export { another };
      `,
    },
    {
      code: stripIndent`
        // https://github.com/cartant/tslint-etc/issues/7
        import * as React from "react";
        import { Foo } from "./foo";

        export const foo = <Foo>foo</Foo>;
      `,
    },
    {
      code: stripIndent`
        // https://github.com/cartant/tslint-etc/issues/8
        function getList<T>(resource: string, urlParams: {}): Promise<{}> {
        }
        export default {
          getList,
        }
      `,
    },
    {
      code: stripIndent`
        // https://github.com/cartant/tslint-etc/issues/10
        it('works', () => {
          let count = 0;
          const result = doSomething(() => count++);
          expect(result).to.equal(0);
        });

        function doSomething(factory: Function) {
          return factory();
        }
      `,
    },
    {
      code: stripIndent`
        // https://github.com/cartant/tslint-etc/issues/13
        import * as React from "react";

        export const HeaderButton = (props: IHeaderButtonProps) => {
          return (
            <TouchableOpacity
              {...props}
            >
              <RText
                style={{
                  color: props.disabled ? "gray" : "black",
                  ...props.textStyle,
                }}
              >
                {props.content}
              </RText>
            </TouchableOpacity>
          );
        };

        HeaderButton.defaultProps = { disabled: false };
      `,
    },
    {
      code: stripIndent`
        // https://github.com/cartant/tslint-etc/issues/19
        import bit, { bot, but } from "./bit";

        const infoWrapper = {
          bit,
          bot,
          but: but
        };

        export default infoWrapper;
      `,
    },
    {
      code: stripIndent`
        // parameters
        function someFunction(someParameter: number) {}
        console.log(someFunction);
        const someArrowFunction = (someParameter: number) => {};
        console.log(someArrowFunction);
        class SomeClass {
          constructor(someParameter: number) {}
          someMethod(someParameter: number) {}
          set someProperty(someValue: number) {}
        }
        console.log(new SomeClass());
      `,
    },
    {
      code: stripIndent`
        // destructured array parameters
        function someFunction([someParameter]: any[]) {}
        console.log(someFunction);
        const someArrowFunction = ([someParameter]: any[]) => {};
        console.log(someArrowFunction);
        class SomeClass {
          constructor([someParameter]: any[]) {}
          someMethod([someParameter]: any[]) {}
          set someProperty([someValue]: any[]) {}
        }
        console.log(new SomeClass());
      `,
    },
    {
      code: stripIndent`
        // destructured object parameters
        function someFunction({ someParameter }: any) {}
        console.log(someFunction);
        const someArrowFunction = ({ someParameter }: any) => {};
        console.log(someArrowFunction);
        class SomeClass {
          constructor({ someParameter }: any) {}
          someMethod({ someParameter }: any) {}
          set someProperty({ someValue }: any) {}
        }
        console.log(new SomeClass());
      `,
    },
    {
      code: stripIndent`
        // parameter properties
        export class SomeClass {
          constructor(
            public somePublicProperty: number,
            protected someProtectedProperty: number,
            private somePrivateProperty: number
          ) {}
        };
      `,
    },
    {
      code: stripIndent`
        // named functions
        const someVariable = function someFunction() {};
        console.log(someVariable);

        function anotherFunction() {
          return function innerFunction() {}
        }
        console.log(anotherFunction);
      `,
    },
    {
      code: stripIndent`
        // declared
        declare const someVariable: number;
        declare function someFunction(someParameter: number): void;
      `,
    },
    {
      code: stripIndent`
        // named functions
        const someVariable = function someFunction() {};
        console.log(someVariable);
        function anotherFunction() {
          return function innerFunction() {}
        }
        console.log(anotherFunction);
      `,
    },
    {
      code: stripIndent`
        // jsx comment
        /* @jsx jsx */
        import { jsx } from "@emotion/core";
        import { Foo } from "./foo";
        export const foo = <Foo>foo</Foo>;
      `,
    },
    {
      code: stripIndent`
        // caught error
        try {
          console.log("hello");
        } catch (error) {
          console.log("wtf?");
        }
      `,
    },
    {
      code: stripIndent`
        // extended interface
        // https://github.com/cartant/eslint-plugin-etc/issues/16
        interface Foo {
          x: string;
        }

        export interface Bar extends Foo {
          y: string;
        }
      `,
    },
    {
      code: stripIndent`
        // unused interface with declarations disabled
        // https://github.com/cartant/eslint-plugin-etc/issues/16
        interface Foo {
          x: string;
        }
      `,
      options: [
        {
          declarations: false,
        },
      ],
    },
    {
      code: stripIndent`
        // global interface merging
        // https://github.com/cartant/eslint-plugin-etc/issues/18
        declare global {
          interface Window {
            myGlobalVar?: string;
          }
        }
      `,
    },
    {
      code: stripIndent`
        // module interface merging
        declare module "rxjs/internal/Subject" {
          interface Subject<T> {
            next(value: T | null): void;
          }
        }
      `,
    },
    {
      code: stripIndent`
        // default import type reference
        // https://github.com/cartant/eslint-plugin-etc/issues/17
        import admin from 'firebase-admin';
        export async function getToken(
          firebaseAuth: admin.auth.Auth,
        ) {
          return firebaseAuth.createCustomToken('user');
        }
      `,
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // only declarations
        import { a } from "./letters";
        import { a as alias } from "./letters";
        import * as l from "./letters";
        import letters from "./letters";
        import L, { e } from "./letters";

        const x = "x";
              ~ [forbidden { "name": "x" }]
        const [y] = ["y"];
               ~ [forbidden { "name": "y" }]
        const { z } = { z: "z" };
                ~ [forbidden { "name": "z" }]
      `,
      {
        options: [
          {
            declarations: true,
            imports: false,
          },
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
        `,
      }
    ),
    fromFixture(
      stripIndent`
        // only imports
        import { a } from "./letters";
                 ~ [forbidden { "name": "a" }]
        import { a as alias } from "./letters";
                      ~~~~~ [forbidden { "name": "alias" }]
        import * as l from "./letters";
                    ~ [forbidden { "name": "l" }]
        import letters from "./letters";
               ~~~~~~~ [forbidden { "name": "letters" }]
        import L, { e } from "./letters";
               ~ [forbidden { "name": "L" }]
                    ~ [forbidden { "name": "e" }]
        const x = "x";
        const [y] = ["y"];
        const { z } = { z: "z" };
      `,
      {
        options: [
          {
            declarations: false,
            imports: true,
          },
        ],
        // TODO:
        // output: stripIndent`
        //   // only imports
        //   const x = "x";
        //   const [y] = ["y"];
        //   const { z } = { z: "z" };
        // `
      }
    ),
    fromFixture(
      stripIndent`
        // reassigned
        const a = "a";
        let b = "b";
            ~ [forbidden { "name": "b" }]
        var c = "c";
            ~ [forbidden { "name": "c" }]

        b = a;
        c = a;
      `,
      {
        output: stripIndent`
          // reassigned
          const a = "a";
          let b = "b";
          var c = "c";

          b = a;
          c = a;
        `,
      }
    ),
    fromFixture(
      stripIndent`
        // shadowed
        import { b } from "./letters";
                 ~ [forbidden { "name": "b" }]
        const a = "a";
              ~ [forbidden { "name": "a" }]

        export function f(a: string, b: string): void {
          console.log(a, b);
        }
      `,
      {
        // TODO:
        // output: stripIndent`
        //   // shadowed
        //   const a = "a";
        //
        //   export function f(a: string, b: string): void {
        //     console.log(a, b);
        //   }
        // `
      }
    ),
    fromFixture(
      stripIndent`
        // some used imports
        import { a, b, c } from "./letters";
                 ~ [forbidden { "name": "a" }]
                       ~ [forbidden { "name": "c" }]
        import {
          a as apple,
               ~~~~~ [forbidden { "name": "apple" }]
          b as banana,
          c as cherry
               ~~~~~~ [forbidden { "name": "cherry" }]
        } from "./letters";

        import t, { d } from "./letters";
                    ~ [forbidden { "name": "d" }]
        import u, { e as egg } from "./letters";
                         ~~~ [forbidden { "name": "egg" }]
        import v, { f } from "./letters";
               ~ [forbidden { "name": "v" }]
                    ~ [forbidden { "name": "f" }]
        import w, { g as grape } from "./letters";
               ~ [forbidden { "name": "w" }]
                         ~~~~~ [forbidden { "name": "grape" }]
        console.log(b, banana, t, u);
      `,
      {
        // TODO:
        // output: stripIndent`
        //   // some used imports
        //   import { b } from "./letters";
        //   import {
        //     b as banana
        //   } from "./letters";
        //
        //   import t from "./letters";
        //   import u from "./letters";
        //
        //   console.log(b, banana, t, u);
        // `
      }
    ),
    fromFixture(
      stripIndent`
        // unused classes
        class Person {}
              ~~~~~~ [forbidden { "name": "Person" }]
      `,
      {
        output: stripIndent`
          // unused classes
          class Person {}
        `,
      }
    ),
    fromFixture(
      stripIndent`
        // unused destructuring
        const instance = { property: 42 };
        const array = [54];

        console.log(instance, array);

        const { property } = instance;
                ~~~~~~~~ [forbidden { "name": "property" }]
        const { property: renamed } = instance;
                          ~~~~~~~ [forbidden { "name": "renamed" }]
        const [element] = array;
               ~~~~~~~ [forbidden { "name": "element" }]

        function f({ name }: { name?: string }): void {}
        function g({ name: renamed }: { name?: string }): void {}

        console.log(f.toString(), g.toString());

        const { a, b, ...rest } = { a: 1, b: 2, c: 3 };
                         ~~~~ [forbidden { "name": "rest" }]

        console.log(a);
      `,
      {
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
        `,
      }
    ),
    fromFixture(
      stripIndent`
        // unused enums
        enum WTF { TRUE, FALSE, FILE_NOT_FOUND }
             ~~~ [forbidden { "name": "WTF" }]
      `,
      {
        output: stripIndent`
          // unused enums
          enum WTF { TRUE, FALSE, FILE_NOT_FOUND }
        `,
      }
    ),
    fromFixture(
      stripIndent`
        // unused functions
        function f(): void {}
                 ~ [forbidden { "name": "f" }]
        const g = () => {};
              ~ [forbidden { "name": "g" }]
      `,
      {
        output: stripIndent`
          // unused functions
          function f(): void {}
          const g = () => {};
        `,
      }
    ),
    fromFixture(
      stripIndent`
        // unused imports
        import { a } from "./letters";
                 ~ [forbidden { "name": "a" }]
        import { b } from "./letters";
        import { c, d } from "./letters";
                 ~ [forbidden { "name": "c" }]
                    ~ [forbidden { "name": "d" }]
        import { a as anise } from "./letters";
                      ~~~~~ [forbidden { "name": "anise" }]
        import { b as basil } from "./letters";
        import {
          c as carrot,
               ~~~~~~ [forbidden { "name": "carrot" }]
          d as dill
               ~~~~ [forbidden { "name": "dill" }]
        } from "./letters";
        import * as l from "./letters";
                    ~ [forbidden { "name": "l" }]
        import letters from "./letters";
               ~~~~~~~ [forbidden { "name": "letters" }]
        import L, { e } from "./letters";
               ~ [forbidden { "name": "L" }]
                    ~ [forbidden { "name": "e" }]

        console.log(b, basil);
        console.log("the end");
      `,
      {
        // TODO:
        // output: stripIndent`
        //   // unused imports
        //   import { b } from "./letters";
        //   import { b as basil } from "./letters";
        //
        //   console.log(b, basil);
        //   console.log("the end");
        // `
      }
    ),
    fromFixture(
      stripIndent`
        // unused types
        interface SomeInterface {}
                  ~~~~~~~~~~~~~ [forbidden { "name": "SomeInterface" }]
        type SomeType = {};
             ~~~~~~~~ [forbidden { "name": "SomeType" }]
      `,
      {
        output: stripIndent`
          // unused types
          interface SomeInterface {}
          type SomeType = {};
        `,
      }
    ),
    fromFixture(
      stripIndent`
        // unused variables
        const a = "a";
              ~ [forbidden { "name": "a" }]
        let b = "b";
            ~ [forbidden { "name": "b" }]
        var c = "c";
            ~ [forbidden { "name": "c" }]
      `,
      {
        output: stripIndent`
          // unused variables
          const a = "a";
          let b = "b";
          var c = "c";
        `,
      }
    ),
    // TODO:
    // fromFixture(
    //   stripIndent`
    //     // no JSX
    //     import * as React from "react";
    //                 ~~~~~ [forbidden { "name": "TK" }]
    //   `
    // ),
    fromFixture(
      stripIndent`
        // https://github.com/cartant/tslint-etc/issues/15 (1)
        import * as dotenv from "dotenv";
        import * as Hapi from "hapi";
        import * as path from "path";
        dotenv.config({ path: path.join(__dirname, "../.env") });
        import { ResetTemplateCache } from "./getTemplate";
                 ~~~~~~~~~~~~~~~~~~ [forbidden { "name": "ResetTemplateCache" }]
        import {
        RequestMethod,
        ~~~~~~~~~~~~~ [forbidden { "name": "RequestMethod" }]
        sendAsanaRequest,
        ~~~~~~~~~~~~~~~~ [forbidden { "name": "sendAsanaRequest" }]
        } from "./sendAsanaRequest";
        import "./arrayIncludesShim";
        import { startAsanaTimer } from "./startAsanaTimer";
                 ~~~~~~~~~~~~~~~ [forbidden { "name": "startAsanaTimer" }]
        const server = new Hapi.Server();
              ~~~~~~ [forbidden { "name": "server" }]
      `,
      {
        // TODO:
        // output: stripIndent`
        //   // https://github.com/cartant/tslint-etc/issues/15 (1)
        //   import * as dotenv from "dotenv";
        //   import * as Hapi from "hapi";
        //   import * as path from "path";
        //   dotenv.config({ path: path.join(__dirname, "../.env") });
        //   import "./arrayIncludesShim";
        //   const server = new Hapi.Server();
        // `
      }
    ),
    fromFixture(
      stripIndent`
        // https://github.com/cartant/tslint-etc/issues/15 (2)
        import * as dotenv from "dotenv";
        import * as Hapi from "hapi";
        import * as path from "path";
        dotenv.config({ path: path.join(__dirname, "../.env") });
        import {
        ResetTemplateCache,
        ~~~~~~~~~~~~~~~~~~ [forbidden { "name": "ResetTemplateCache" }]
        } from "./getTemplate";
        import {
        hasActiveRequest,
        ~~~~~~~~~~~~~~~~ [forbidden { "name": "hasActiveRequest" }]
        RequestMethod,
        ~~~~~~~~~~~~~ [forbidden { "name": "RequestMethod" }]
        sendAsanaRequest,
        ~~~~~~~~~~~~~~~~ [forbidden { "name": "sendAsanaRequest" }]
        } from "./sendAsanaRequest";
        import "./arrayIncludesShim";
        import { startAsanaTimer } from "./startAsanaTimer";
                 ~~~~~~~~~~~~~~~ [forbidden { "name": "startAsanaTimer" }]
        const server = new Hapi.Server();
              ~~~~~~ [forbidden { "name": "server" }]
      `,
      {
        // TODO:
        // output: stripIndent`
        //   // https://github.com/cartant/tslint-etc/issues/15 (2)
        //   import * as dotenv from "dotenv";
        //   import * as Hapi from "hapi";
        //   import * as path from "path";
        //   dotenv.config({ path: path.join(__dirname, "../.env") });
        //   import "./arrayIncludesShim";
        //   const server = new Hapi.Server();
        // `
      }
    ),
    fromFixture(
      stripIndent`
        // https://github.com/cartant/tslint-etc/issues/15 (3)
        import * as dotenv from "dotenv";
        import * as Hapi from "hapi";
        import * as path from "path";
        dotenv.config({ path: path.join(__dirname, "../.env") });
        import { ResetTemplateCache } from "./getTemplate";
                 ~~~~~~~~~~~~~~~~~~ [forbidden { "name": "ResetTemplateCache" }]
        import {
        RequestMethod,
        ~~~~~~~~~~~~~ [forbidden { "name": "RequestMethod" }]
        sendAsanaRequest,
        ~~~~~~~~~~~~~~~~ [forbidden { "name": "sendAsanaRequest" }]
        } from "./sendAsanaRequest";
        // Just import the module to run the code inside and create global Array shim
        import "./arrayIncludesShim";
        import { startAsanaTimer } from "./startAsanaTimer";
                 ~~~~~~~~~~~~~~~ [forbidden { "name": "startAsanaTimer" }]
        const server = new Hapi.Server();
              ~~~~~~ [forbidden { "name": "server" }]
      `,
      {
        // TODO:
        // output: stripIndent`
        //   // https://github.com/cartant/tslint-etc/issues/15 (3)
        //   import * as dotenv from "dotenv";
        //   import * as Hapi from "hapi";
        //   import * as path from "path";
        //   dotenv.config({ path: path.join(__dirname, "../.env") });
        //   // Just import the module to run the code inside and create global Array shim
        //   import "./arrayIncludesShim";
        //   const server = new Hapi.Server();
        // `
      }
    ),
    fromFixture(
      stripIndent`
        // https://github.com/cartant/tslint-etc/issues/34 (declaration)
        /**
         * @copyright Copyright someone sometime
         */

        import nope from "rxjs";
               ~~~~ [forbidden { "name": "nope" }]
      `,
      {
        // TODO:
        // output: stripIndent`
        //   // https://github.com/cartant/tslint-etc/issues/34 (declaration)
        //   /**
        //    * @copyright Copyright someone sometime
        //    */
        // `
      }
    ),
    fromFixture(
      stripIndent`
        // https://github.com/cartant/tslint-etc/issues/34 (named)
        /**
         * @copyright Copyright someone sometime
         */

        import { Subject } from "rxjs";
                 ~~~~~~~ [forbidden { "name": "Subject" }]
      `,
      {
        // TODO:
        // output: stripIndent`
        //   // https://github.com/cartant/tslint-etc/issues/34 (named)
        //   /**
        //    * @copyright Copyright someone sometime
        //    */
        // `
      }
    ),
    fromFixture(
      stripIndent`
        // https://github.com/cartant/tslint-etc/issues/34 (namespace)
        /**
         * @copyright Copyright someone sometime
         */

        import * as Rx from "rxjs";
                    ~~ [forbidden { "name": "Rx" }]
      `,
      {
        // TODO:
        // output: stripIndent`
        //   // https://github.com/cartant/tslint-etc/issues/34 (namespace)
        //   /**
        //    * @copyright Copyright someone sometime
        //    */
        // `
      }
    ),
    fromFixture(
      stripIndent`
        // unused rest destructuring
        const { a, b, ...rest } = { a: 1, b: 2, c: 3 };
                         ~~~~ [forbidden { "name": "rest" }]
      `
    ),
  ],
});
