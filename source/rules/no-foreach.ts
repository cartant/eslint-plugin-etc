/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { getTypeServices, isMemberExpression } from "eslint-etc";
import { ruleCreator } from "../utils";

const defaultOptions: readonly {
  types?: string[];
}[] = [];

const rule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      description: "Forbids calling `forEach`.",
      recommended: false,
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      forbidden: "Calling `forEach` is forbidden.",
    },
    schema: [
      {
        properties: {
          types: {
            items: {
              type: "string",
            },
            type: "array",
          },
        },
        type: "object",
      },
    ],
    type: "problem",
  },
  name: "no-foreach",
  create: (context, unused: typeof defaultOptions) => {
    const [config = {}] = context.options;
    const types = config?.types ?? ["Array", "Map", "NodeList", "Set"];
    const typesRegExp = new RegExp(`^${types.join("|")}$`);
    const { couldBeType } = getTypeServices(context);
    return {
      "CallExpression[callee.property.name='forEach']": (
        callExpression: es.CallExpression
      ) => {
        const { callee } = callExpression;
        if (!isMemberExpression(callee)) {
          return;
        }
        if (!couldBeType(callee.object, typesRegExp)) {
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
