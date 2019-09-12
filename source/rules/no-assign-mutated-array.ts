/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { Rule } from "eslint";
import { getParent, getParserServices } from "eslint-etc";
import * as es from "estree";
import { couldBeType } from "tsutils-etc";
import * as ts from "typescript";

const mutatorRegExp = /^(fill|reverse|sort|splice)$/;
const creatorRegExp = /^(concat|entries|filter|keys|map|slice|values)$/;

function isExpressionStatement(node: es.Node): node is es.ExpressionStatement {
  return node && node.type === "ExpressionStatement";
}

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "General",
      description: "Forbids the assignment of returned, mutated arrays.",
      recommended: false
    },
    fixable: null,
    messages: {
      forbidden: "Assignment of mutated arrays is forbidden."
    }
  },
  create: context => {
    const { esTreeNodeToTSNodeMap, program } = getParserServices(context);
    const typeChecker = program.getTypeChecker();
    return {
      [`CallExpression > MemberExpression[property.name=${mutatorRegExp.toString()}]`]: (
        memberExpression: es.MemberExpression
      ) => {
        const callExpression = getParent(memberExpression) as es.CallExpression;
        const parent = getParent(callExpression);
        if (!isExpressionStatement(parent)) {
          const propertyAccessExpression = esTreeNodeToTSNodeMap.get(
            memberExpression
          ) as ts.PropertyAccessExpression;
          const type = typeChecker.getTypeAtLocation(
            propertyAccessExpression.expression
          );
          if (
            couldBeType(type, "Array") &&
            mutatesReferencedArray(esTreeNodeToTSNodeMap.get(
              callExpression
            ) as ts.CallExpression)
          ) {
            context.report({
              messageId: "forbidden",
              node: memberExpression.property
            });
          }
        }
      }
    };

    function mutatesReferencedArray(
      callExpression: ts.CallExpression
    ): boolean {
      if (ts.isPropertyAccessExpression(callExpression.expression)) {
        const propertyAccessExpression = callExpression.expression;
        const { expression, name } = propertyAccessExpression;
        if (creatorRegExp.test(name.getText())) {
          return false;
        }
        if (ts.isCallExpression(expression)) {
          return mutatesReferencedArray(expression);
        }
        if (ts.isArrayLiteralExpression(expression)) {
          return false;
        }
      }
      return true;
    }
  }
};

export = rule;
