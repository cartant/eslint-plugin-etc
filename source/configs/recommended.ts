/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

export = {
  plugins: ["etc"],
  rules: {
    "etc/no-assign-mutated-array": "error",
    "etc/no-deprecated": "warn",
    "etc/no-implicit-any-catch": "error",
    "etc/no-internal": "error",
  },
};
