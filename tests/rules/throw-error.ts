/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/throw-error");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("throw-error", rule, {
  valid: [
    {
      code: stripIndent`
        // throwing errows
        export const a = () => { throw new Error("kaboom"); };

        try {
          throw new Error("kaboom");
        } catch (error: any) {
          throw error;
        }

        function b(error: any): never {
          throw error;
        }
      `,
    },
    {
      code: stripIndent`
        // rejecting errors
        export const a = Promise.reject(new Error("kaboom"));
        export const b = new Promise((resolve, reject) => reject(new Error("kaboom")));
        export const c = new Promise(function (resolve, reject) { reject(new Error("kaboom")); });
        export const d = new Promise((resolve) => resolve(42));
        export const e = new Promise(function (resolve) { resolve(56); });
        export const f = new Promise(function func(resolve) { resolve(56); });
      `,
    },
    {
      code: stripIndent`
        // rejecting any errors
        const kaboom: any = new Error("kaboom");
        export const g = Promise.reject(kaboom);
        export const h = new Promise(function (resolve, reject) { reject(kaboom); });
        export const i = new Promise(function func(resolve, reject) { reject(kaboom); });
      `,
    },
    {
      code: stripIndent`
        // issue #1
        const watchIntegrationAssets = gulp.series(
          copyIntegrationAssets,
          async function watchIntegrationAssets(): Promise<void> {
            await new Promise<never>((_, reject) => {
              gulp.watch(INTEGRATION_FILES, copyIntegrationAssets).on('error', reject)
            })
          }
        );
      `,
    },
  ],
  invalid: [
    {
      code: stripIndent`
        // throwing non-errors
        export const a = () => { throw "kaboom"; };

        try {
          throw "kaboom";
        } catch (error: any) {
          throw error;
        }

        function b(error: any): never {
          throw error;
        }
      `,
      errors: [
        {
          messageId: "forbidden",
          data: { usage: "Throwing" },
          line: 2,
          column: 32,
          endLine: 2,
          endColumn: 40,
        },
        {
          messageId: "forbidden",
          data: { usage: "Throwing" },
          line: 5,
          column: 9,
          endLine: 5,
          endColumn: 17,
        },
      ],
    },
    {
      code: stripIndent`
        // rejecting non-errors
        export const a = Promise.reject("kaboom");
        export const b = new Promise((resolve, reject) => reject("kaboom"));
        export const c = new Promise(function (resolve, reject) { reject("kaboom"); });
        export const d = new Promise(function func(resolve, reject) { reject("kaboom"); });
      `,
      errors: [
        {
          messageId: "forbidden",
          data: { usage: "Rejecting with" },
          line: 2,
          column: 33,
          endLine: 2,
          endColumn: 41,
        },
        {
          messageId: "forbidden",
          data: { usage: "Rejecting with" },
          line: 3,
          column: 58,
          endLine: 3,
          endColumn: 66,
        },
        {
          messageId: "forbidden",
          data: { usage: "Rejecting with" },
          line: 4,
          column: 66,
          endLine: 4,
          endColumn: 74,
        },
        {
          messageId: "forbidden",
          data: { usage: "Rejecting with" },
          line: 5,
          column: 70,
          endLine: 5,
          endColumn: 78,
        },
      ],
    },
  ],
});
