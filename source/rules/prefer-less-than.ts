/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import {
  TSESLint as eslint,
  TSESTree as es,
} from "@typescript-eslint/experimental-utils";
import { ruleCreator } from "../utils";

const rule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      category: "Best Practices",
      description: "Forbids greater-than comparisons.",
      recommended: false,
    },
    fixable: "code",
    messages: {
      forbiddenGT: "Greater-than comparisons are forbidden.",
      forbiddenGTE: "Greater-than-or-equal comparisons are forbidden.",
      suggestLT: "Use a less-than comparison instead.",
      suggestLTE: "Use a less-than-or-equal comparison instead.",
    },
    schema: [],
    type: "suggestion",
  },
  name: "prefer-less-than",
  create: (context) => {
    return {
      "BinaryExpression[operator=/^(>|>=)$/]": (
        expression: es.BinaryExpression
      ) => {
        const gte = expression.operator === ">=";
        function fix(fixer: eslint.RuleFixer) {
          const { left, right } = expression;
          const sourceCode = context.getSourceCode();
          const operator = sourceCode.getTokenAfter(left);
          return operator
            ? [
                fixer.replaceText(left, sourceCode.getText(right)),
                fixer.replaceTextRange(operator.range, gte ? "<=" : "<"),
                fixer.replaceText(right, sourceCode.getText(left)),
              ]
            : [];
        }
        context.report({
          fix,
          messageId: gte ? "forbiddenGTE" : "forbiddenGT",
          node: expression,
          suggest: [
            {
              fix,
              messageId: gte ? "suggestLTE" : "suggestLT",
            },
          ],
        });
      },
    };
  },
});

export = rule;
