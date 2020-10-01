/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { ruleCreator } from "../utils";
import baseRule = require("./no-deprecated");

const defaultOptions: {
  ignored?: Record<string, string>;
}[] = [];

const rule = ruleCreator({
  defaultOptions,
  meta: {
    ...(baseRule.meta as any),
    deprecated: true,
    replacedBy: ["no-deprecated"],
  },
  name: "deprecation",
  create: (context) => baseRule.create(context as any),
});

export = rule;
