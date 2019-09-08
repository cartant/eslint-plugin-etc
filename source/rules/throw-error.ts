/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { Rule } from "eslint";
import {
  getLoc,
  getParent,
  getParserServices,
  isCallExpression
} from "eslint-etc";
import * as es from "estree";
import { couldBeType, isAny } from "tsutils-etc";
import * as ts from "typescript";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "General",
      description: "Forbids throwing - or rejecting with - non-`Error` values.",
      recommended: false
    },
    fixable: null,
    messages: {
      forbidden: "{{usage}} non-`Error` values is forbidden."
    }
  },
  create: context => {
    const sourceCode = context.getSourceCode();
    const { esTreeNodeToTSNodeMap, program } = getParserServices(context);
    const typeChecker = program.getTypeChecker();

    const validateRejection = (node: es.CallExpression) => {
      const {
        arguments: [arg]
      } = esTreeNodeToTSNodeMap.get(node) as ts.CallExpression;
      const argType = typeChecker.getTypeAtLocation(arg);
      if (!isAny(argType) && !couldBeType(argType, "Error")) {
        context.report({
          data: { usage: "Rejecting with" },
          loc: getLoc(arg),
          messageId: "forbidden"
        });
      }
    };

    return {
      "CallExpression > MemberExpression[property.name='reject']": (
        node: es.MemberExpression
      ) => {
        const lhsExpression = esTreeNodeToTSNodeMap.get(
          node.object
        ) as ts.LeftHandSideExpression;
        const lhsType = typeChecker.getTypeAtLocation(lhsExpression);
        if (!couldBeType(lhsType, /^Promise/)) {
          return;
        }
        validateRejection(getParent(node) as es.CallExpression);
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
          .find(variable => variable.name === text);
        if (!variable) {
          return;
        }
        variable.references.forEach(ref => {
          const parent = getParent(ref.identifier);
          if (isCallExpression(parent)) {
            validateRejection(parent);
          }
        });
      },
      ThrowStatement: (node: es.ThrowStatement) => {
        const { expression } = esTreeNodeToTSNodeMap.get(
          node
        ) as ts.ThrowStatement;
        const type = typeChecker.getTypeAtLocation(expression);
        if (!isAny(type) && !couldBeType(type, "Error")) {
          context.report({
            data: { usage: "Throwing" },
            loc: getLoc(expression),
            messageId: "forbidden"
          });
        }
      }
    };
  }
};

export = rule;
