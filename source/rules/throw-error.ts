/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { getParent, getTypeServices, isCallExpression } from "eslint-etc";
import { ruleCreator } from "../utils";

const rule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      category: "Best Practices",
      description: "Forbids throwing - or rejecting with - non-`Error` values.",
      recommended: false,
    },
    fixable: undefined,
    messages: {
      forbidden: "{{usage}} non-`Error` values is forbidden.",
    },
    schema: [],
    type: "problem",
  },
  name: "throw-error",
  create: (context) => {
    const sourceCode = context.getSourceCode();
    const { couldBeType, isAny } = getTypeServices(context);

    const checkRejection = (node: es.CallExpression) => {
      const {
        arguments: [arg],
      } = node;
      if (!isAny(arg) && !couldBeType(arg, "Error")) {
        context.report({
          data: { usage: "Rejecting with" },
          messageId: "forbidden",
          node: arg,
        });
      }
    };

    return {
      "CallExpression > MemberExpression[property.name='reject']": (
        node: es.MemberExpression
      ) => {
        if (!couldBeType(node.object, /^Promise/)) {
          return;
        }
        checkRejection(getParent(node) as es.CallExpression);
      },
      "NewExpression[callee.name='Promise'] > ArrowFunctionExpression, NewExpression[callee.name='Promise'] > FunctionExpression": (
        node: es.ArrowFunctionExpression | es.FunctionExpression
      ) => {
        const [, param] = node.params;
        if (!param) {
          return;
        }
        const text = sourceCode.getText(param);
        const variable = context
          .getDeclaredVariables(node)
          .find((variable) => variable.name === text);
        if (!variable) {
          return;
        }
        variable.references.forEach(({ identifier }) => {
          const parent = getParent(identifier) as es.Node;
          if (isCallExpression(parent) && identifier === parent.callee) {
            checkRejection(parent);
          }
        });
      },
      ThrowStatement: (node: es.ThrowStatement) => {
        if (
          node.argument &&
          !isAny(node.argument) &&
          !couldBeType(node.argument, /^(Error|DOMException)$/)
        ) {
          context.report({
            data: { usage: "Throwing" },
            messageId: "forbidden",
            node: node.argument,
          });
        }
      },
    };
  },
});

export = rule;
