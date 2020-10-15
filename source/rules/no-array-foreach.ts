/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { ruleCreator } from "../utils";
import baseRule = require("./no-foreach");

const rule = ruleCreator({
  defaultOptions: [],
  meta: {
    deprecated: true,
    docs: {
      category: "Best Practices",
      description: "Forbids calling `forEach` on arrays.",
      recommended: false,
    },
    fixable: undefined,
    messages: {
      forbidden: "Calling `forEach` on arrays is forbidden.",
    },
    replacedBy: ["etc/no-foreach"],
    schema: [],
    type: "problem",
  },
  name: "no-array-foreach",
  create: (context) =>
    baseRule.create(
      Object.create(context, {
        options: { value: [{ types: ["Array"] }] },
      })
    ),
});

export = rule;
