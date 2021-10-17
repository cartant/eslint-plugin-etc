/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import {
  AST_NODE_TYPES,
  TSESLint as eslint,
  TSESTree as es,
} from "@typescript-eslint/experimental-utils";
import {
  getTypeServices,
  hasTypeAnnotation,
  isArrowFunctionExpression,
  isFunctionExpression,
  isMemberExpression,
} from "eslint-etc";
import { ruleCreator } from "../utils";

function isParenthesised(
  sourceCode: Readonly<eslint.SourceCode>,
  node: es.Node
) {
  const before = sourceCode.getTokenBefore(node);
  const after = sourceCode.getTokenAfter(node);
  return (
    before &&
    after &&
    before.value === "(" &&
    before.range[1] <= node.range[0] &&
    after.value === ")" &&
    after.range[0] >= node.range[1]
  );
}

const defaultOptions: readonly {
  allowExplicitAny?: boolean;
}[] = [];

const rule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      description:
        "Forbids implicit `any` error parameters in promise rejections.",
      recommended: false,
      suggestion: true,
    },
    fixable: "code",
    hasSuggestions: true,
    messages: {
      explicitAny: "Explicit `any` in promise rejection.",
      implicitAny: "Implicit `any` in promise rejection.",
      narrowed: "Error type must be `unknown` or `any`.",
      suggestExplicitUnknown:
        "Use `unknown` instead, this will force you to explicitly and safely assert the type is correct.",
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          allowExplicitAny: {
            type: "boolean",
          },
        },
        type: "object",
      },
    ],
    type: "suggestion",
  },
  name: "no-implicit-any-catch",
  create: (context, unused: typeof defaultOptions) => {
    const { couldBeType } = getTypeServices(context);
    const [config = {}] = context.options;
    const { allowExplicitAny = false } = config;
    const sourceCode = context.getSourceCode();

    function checkRejectionCallback(
      callExpression: es.CallExpression,
      callback: es.Node
    ) {
      if (
        !isArrowFunctionExpression(callback) &&
        !isFunctionExpression(callback)
      ) {
        return;
      }
      const [param] = callback.params;
      if (!param) {
        return;
      }
      if (hasTypeAnnotation(param)) {
        const { typeAnnotation } = param;
        const {
          typeAnnotation: { type },
        } = typeAnnotation;
        if (type === AST_NODE_TYPES.TSAnyKeyword) {
          if (allowExplicitAny) {
            return;
          }
          if (!isPromiseCall(callExpression)) {
            return;
          }
          function fix(fixer: eslint.RuleFixer) {
            return fixer.replaceText(typeAnnotation, ": unknown");
          }
          context.report({
            fix,
            messageId: "explicitAny",
            node: param,
            suggest: [
              {
                messageId: "suggestExplicitUnknown",
                fix,
              },
            ],
          });
        } else if (type !== AST_NODE_TYPES.TSUnknownKeyword) {
          if (!isPromiseCall(callExpression)) {
            return;
          }
          function fix(fixer: eslint.RuleFixer) {
            return fixer.replaceText(typeAnnotation, ": unknown");
          }
          context.report({
            messageId: "narrowed",
            node: param,
            suggest: [
              {
                messageId: "suggestExplicitUnknown",
                fix,
              },
            ],
          });
        }
      } else {
        if (!isPromiseCall(callExpression)) {
          return;
        }
        function fix(fixer: eslint.RuleFixer) {
          if (isParenthesised(sourceCode, param)) {
            return fixer.insertTextAfter(param, ": unknown");
          }
          return [
            fixer.insertTextBefore(param, "("),
            fixer.insertTextAfter(param, ": unknown)"),
          ];
        }
        context.report({
          fix,
          messageId: "implicitAny",
          node: param,
          suggest: [
            {
              messageId: "suggestExplicitUnknown",
              fix,
            },
          ],
        });
      }
    }

    function isPromiseCall(callExpression: es.CallExpression) {
      const { callee } = callExpression;
      if (!isMemberExpression(callee)) {
        return false;
      }
      return couldBeType(callee.object, "Promise");
    }

    return {
      "CallExpression[callee.property.name='catch']": (
        callExpression: es.CallExpression
      ) => {
        const [callback] = callExpression.arguments;
        if (callback) {
          checkRejectionCallback(callExpression, callback);
        }
      },
      "CallExpression[callee.property.name='then']": (
        callExpression: es.CallExpression
      ) => {
        const [, callback] = callExpression.arguments;
        if (callback) {
          checkRejectionCallback(callExpression, callback);
        }
      },
    };
  },
});

export = rule;
