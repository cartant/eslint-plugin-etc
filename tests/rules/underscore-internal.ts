/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/underscore-internal");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("underscore-internal", rule, {
  valid: [
    {
      code: stripIndent`
        /**
         * Some class
         */
        export class SomeClass {}
      `,
    },
    {
      code: stripIndent`
        /**
         * Some internal class with _
         * @internal
         */
        export class _SomeClass {}
      `,
    },
    {
      code: stripIndent`
        export class SomeClass {
          /**
           * Some class method
           */
          someMethod() {}
        }
      `,
    },
    {
      code: stripIndent`
        export class SomeClass {
          /**
           * Some internal class method with _
           * @internal
           */
          _someMethod() {}
        }
      `,
    },
    {
      code: stripIndent`
        export class SomeClass {
          /**
           * Some class property
           */
          someProperty: unknown;
        }
      `,
    },
    {
      code: stripIndent`
        export class SomeClass {
          /**
           * Some internal class property with _
           * @internal
           */
          _someProperty: unknown;
        }
      `,
    },
    {
      code: stripIndent`
        /**
         * Some constant
         */
        export const SOME_CONSTANT = 0;
      `,
    },
    {
      code: stripIndent`
        /**
         * Some internal constant with _
         * @internal
         */
        export const _SOME_CONSTANT = 0;
      `,
    },
    {
      code: stripIndent`
        /**
         * Some enum
         */
        export enum SomeEnum {}
      `,
    },
    {
      code: stripIndent`
        /**
         * Some internal enum with _
         * @internal
         */
        export enum _SomeEnum {}
      `,
    },
    {
      code: stripIndent`
        export enum SomeEnum {
          /**
           * Some enum member
           */
          SOME_MEMBER = 0
        }
      `,
    },
    {
      code: stripIndent`
        export enum _SomeEnum {
          /**
           * Some internal enum member with _
           * @internal
           */
          _SOME_MEMBER = 0
        }
      `,
    },
    {
      code: stripIndent`
        /**
         * Some function
         */
        export function someFunction() {}
      `,
    },
    {
      code: stripIndent`
        /**
         * Some internal function with _
         * @internal
         */
        export function _someFunction() {}
      `,
    },
    {
      code: stripIndent`
        /**
         * Some interface
         */
        export interface SomeInterface {}
      `,
    },
    {
      code: stripIndent`
        /**
         * Some internal interface with _
         * @internal
         */
        export interface _SomeInterface {}
      `,
    },
    {
      code: stripIndent`
        export interface SomeInterface {
          /**
           * Some method
           */
          someMethod(): unknown;
        }
      `,
    },
    {
      code: stripIndent`
        export interface SomeInterface {
          /**
           * Some internal method with _
           * @internal
           */
          _someMethod(): unknown;
        }
      `,
    },
    {
      code: stripIndent`
        export interface SomeInterface {
          /**
           * Some interface
           */
          someProperty: unknown;
        }
      `,
    },
    {
      code: stripIndent`
        export interface SomeInterface {
          /**
           * Some internal interface with _
           * @internal
           */
          _someProperty: unknown;
        }
      `,
    },
    {
      code: stripIndent`
        /**
         * Some type alias
         */
        export type SomeType = {};
      `,
    },
    {
      code: stripIndent`
        /**
         * Some internal type alias with _
         * @internal
         */
        export type _SomeType = {};
      `,
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        /**
         * Some internal constant without _
         * @internal
         */
        export const SOME_CONSTANT = 0;
                     ~~~~~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        /**
         * Some internal class without _
         * @internal
         */
        export class SomeClass {}
                     ~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        export class SomeClass {
          /**
           * Some internal class method without _
           * @internal
           */
          someMethod() {}
          ~~~~~~~~~~ [forbidden]
        }
      `
    ),
    fromFixture(
      stripIndent`
        export class SomeClass {
          /**
           * Some internal class property without _
           * @internal
           */
          someProperty: unknown;
          ~~~~~~~~~~~~ [forbidden]
        }
      `
    ),
    fromFixture(
      stripIndent`
        /**
         * Some internal function without _
         * @internal
         */
        export function someFunction() {}
                        ~~~~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        /**
         * Some internal enum without _
         * @internal
         */
        export enum SomeEnum {}
                    ~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        export enum SomeEnum {
          /**
           * Some internal enum member without _
           * @internal
           */
          SOME_MEMBER = 0
          ~~~~~~~~~~~ [forbidden]
        }
      `
    ),
    fromFixture(
      stripIndent`
        /**
         * Some internal interface without _
         * @internal
         */
        export interface SomeInterface {}
                         ~~~~~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        export interface SomeInterface {
          /**
           * Some internal method without _
           * @internal
           */
          someMethod(): unknown;
          ~~~~~~~~~~ [forbidden]
        }
      `
    ),
    fromFixture(
      stripIndent`
        export interface SomeInterface {
          /**
           * Some internal property without _
           * @internal
           */
          someProperty: unknown;
          ~~~~~~~~~~~~ [forbidden]
        }
      `
    ),
    fromFixture(
      stripIndent`
        /**
         * Some internal type alias without _
         * @internal
         */
        export type SomeType = {};
                    ~~~~~~~~ [forbidden]
      `
    ),
  ],
});
