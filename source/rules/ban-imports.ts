/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { ruleCreator } from "../utils";

const defaultOptions: Record<string, boolean>[] = [];

const rule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      category: "Best Practices",
      description: "Forbids using the configured import locations.",
      recommended: false,
    },
    fixable: null,
    messages: {
      forbidden: "This import location is forbidden.",
    },
    schema: [
      {
        type: "object",
      },
    ],
    type: "problem",
  },
  name: "ban-imports",
  create: (context, unused: typeof defaultOptions) => {
    const [config = {}] = context.options;
    const forbiddenRegExps: RegExp[] = [];
    Object.entries(config).forEach(([key, value]) => {
      if (value !== false) {
        forbiddenRegExps.push(new RegExp(key));
      }
    });
    return {
      ImportDeclaration: (node: es.ImportDeclaration) => {
        const { source } = node;
        if (
          forbiddenRegExps.some((regExp) => regExp.test(source.value as string))
        ) {
          context.report({
            messageId: "forbidden",
            node,
          });
        }
      },
    };
  },
});

export = rule;
