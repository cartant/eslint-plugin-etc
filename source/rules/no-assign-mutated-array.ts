/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import {
  getParent,
  getTypeServices,
  isArrayExpression,
  isCallExpression,
  isExpressionStatement,
  isIdentifier,
  isMemberExpression,
  isNewExpression,
} from "eslint-etc";
import { ruleCreator } from "../utils";

const mutatorRegExp = /^(fill|reverse|sort)$/;
const creatorRegExp = /^(concat|entries|filter|keys|map|slice|splice|values)$/;

const rule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      category: "Possible Errors",
      description: "Forbids the assignment of returned, mutated arrays.",
      recommended: false,
    },
    fixable: undefined,
    messages: {
      forbidden: "Assignment of mutated arrays is forbidden.",
    },
    schema: [],
    type: "problem",
  },
  name: "no-assign-mutated-array",
  create: (context) => {
    const { couldBeType } = getTypeServices(context);
    return {
      [`CallExpression > MemberExpression[property.name=${mutatorRegExp.toString()}]`]: (
        memberExpression: es.MemberExpression
      ) => {
        const callExpression = getParent(memberExpression) as es.CallExpression;
        const parent = getParent(callExpression);
        if (parent && !isExpressionStatement(parent)) {
          if (
            couldBeType(memberExpression.object, "Array") &&
            mutatesReferencedArray(callExpression)
          ) {
            context.report({
              messageId: "forbidden",
              node: memberExpression.property,
            });
          }
        }
      },
    };

    function isNewArray(node: es.LeftHandSideExpression): boolean {
      if (isArrayExpression(node)) {
        return true;
      }
      if (isNewExpression(node)) {
        return true;
      }
      if (isCallExpression(node)) {
        const { callee } = node;
        if (isIdentifier(callee) && callee.name === "Array") {
          return true;
        }
        if (
          isMemberExpression(callee) &&
          isIdentifier(callee.object) &&
          callee.object.name === "Array"
        ) {
          return true;
        }
      }
      return false;
    }

    function mutatesReferencedArray(
      callExpression: es.CallExpression
    ): boolean {
      if (isMemberExpression(callExpression.callee)) {
        const memberExpression = callExpression.callee;
        const { object, property } = memberExpression;
        if (isIdentifier(property) && creatorRegExp.test(property.name)) {
          return false;
        }
        if (isNewArray(object)) {
          return false;
        }
        if (isCallExpression(object)) {
          return mutatesReferencedArray(object);
        }
      }
      return true;
    }
  },
});

export = rule;
