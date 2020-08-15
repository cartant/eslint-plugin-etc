/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
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
    fromFixture(
      stripIndent`
        // throwing non-errors
        export const a = () => { throw "kaboom"; };
                                       ~~~~~~~~ [forbidden { "usage": "Throwing" }]
        try {
          throw "kaboom";
                ~~~~~~~~ [forbidden { "usage": "Throwing" }]
        } catch (error: any) {
          throw error;
        }

        function b(error: any): never {
          throw error;
        }
      `
    ),
    fromFixture(
      stripIndent`
        // rejecting non-errors
        export const a = Promise.reject("kaboom");
                                        ~~~~~~~~ [forbidden { "usage": "Rejecting with" }]
        export const b = new Promise((resolve, reject) => reject("kaboom"));
                                                                 ~~~~~~~~ [forbidden { "usage": "Rejecting with" }]
        export const c = new Promise(function (resolve, reject) { reject("kaboom"); });
                                                                         ~~~~~~~~ [forbidden { "usage": "Rejecting with" }]
        export const d = new Promise(function func(resolve, reject) { reject("kaboom"); });
                                                                             ~~~~~~~~ [forbidden { "usage": "Rejecting with" }]
      `
    ),
  ],
});
