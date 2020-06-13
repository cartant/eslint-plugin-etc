/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import {
  getParent,
  getParserServices,
  isExpressionStatement,
} from "eslint-etc";
import { couldBeType } from "tsutils-etc";
import * as ts from "typescript";
import { ruleCreator } from "../utils";

const mutatorRegExp = /^(fill|reverse|sort|splice)$/;
const creatorRegExp = /^(concat|entries|filter|keys|map|slice|values)$/;

const rule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      category: "Possible Errors",
      description: "Forbids the assignment of returned, mutated arrays.",
      recommended: false,
    },
    fixable: null,
    messages: {
      forbidden: "Assignment of mutated arrays is forbidden.",
    },
    schema: {},
    type: "problem",
  },
  name: "no-assign-mutated-array",
  create: (context) => {
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
            mutatesReferencedArray(
              esTreeNodeToTSNodeMap.get(callExpression) as ts.CallExpression
            )
          ) {
            context.report({
              messageId: "forbidden",
              node: memberExpression.property,
            });
          }
        }
      },
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
  },
});

export = rule;
