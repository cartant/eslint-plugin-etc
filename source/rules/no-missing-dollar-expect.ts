/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { Rule } from "eslint";
import * as es from "estree";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "General",
      description:
        "Forbids dtslint `$ExpectType` and `$ExpectError` expectations if the `$` is missing.",
      recommended: false,
    },
    fixable: null,
    messages: {
      forbidden: "Missing $ in dtslint expectation.",
    },
  },
  create: (context) => {
    const sourceCode = context.getSourceCode();
    return {
      Program: (node: es.Program) => {
        const text = sourceCode.getText();
        const regExp = /\/\/\s+Expect(Type|Error)/g;
        let result: RegExpExecArray;

        while ((result = regExp.exec(text))) {
          context.report({
            messageId: "forbidden",
            loc: {
              start: sourceCode.getLocFromIndex(result.index),
              end: sourceCode.getLocFromIndex(result.index + result[0].length),
            },
          });
        }
      },
    };
  },
};

export = rule;
