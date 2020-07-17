/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { getTypeServices, isMemberExpression } from "eslint-etc";
import { ruleCreator } from "../utils";

const rule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      category: "Best Practices",
      description: "Forbids the calling `forEach` on arrays.",
      recommended: false,
    },
    fixable: null,
    messages: {
      forbidden: "Calling `forEach` on arrays is forbidden.",
    },
    schema: null,
    type: "problem",
  },
  name: "no-array-foreach",
  create: (context) => {
    const { couldBeType } = getTypeServices(context);
    return {
      "CallExpression[callee.property.name='forEach']": (
        callExpression: es.CallExpression
      ) => {
        const { callee } = callExpression;
        if (!isMemberExpression(callee)) {
          return;
        }
        if (!couldBeType(callee.object, "Array")) {
          return;
        }
        context.report({
          messageId: "forbidden",
          node: callee.property,
        });
      },
    };
  },
});

export = rule;
