/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { ruleCreator } from "../utils";

const defaultOptions: Record<string, boolean | string>[] = [];

const defaultMessage = "This import location is forbidden.";

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
      forbidden: "{{message}}",
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
    const forbiddenOptions: { regex: RegExp; message?: string }[] = [];
    Object.entries(config).forEach(([key, value]) => {
      if (value !== false && value !== "") {
        const ruleDefinition = {
          regex: new RegExp(key),
          ...(typeof value === "string" ? { message: value } : null),
        };
        forbiddenOptions.push(ruleDefinition);
      }
    });

    return {
      ImportDeclaration: (node: es.ImportDeclaration) => {
        const { source } = node;
        const violation = forbiddenOptions.find(({ regex }) =>
          regex.test(source.value as string)
        );
        if (violation) {
          context.report({
            messageId: "forbidden",
            data: {
              message: violation.message || defaultMessage,
            },
            node,
          });
        }
      },
    };
  },
});

export = rule;
