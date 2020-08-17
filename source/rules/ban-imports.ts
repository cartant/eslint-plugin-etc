/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { ruleCreator } from "../utils";

const defaultMessage = "This import location is forbidden.";
const defaultOptions: Record<string, boolean | string>[] = [];

const rule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      category: "Best Practices",
      description: "Forbids using the configured import locations.",
      recommended: false,
    },
    fixable: undefined,
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
    const bans: { message?: string; regExp: RegExp }[] = [];
    Object.entries(config).forEach(([key, value]) => {
      if (value) {
        const ban: typeof bans[number] = { regExp: new RegExp(key) };
        if (typeof value === "string") {
          ban.message = value;
        }
        bans.push(ban);
      }
    });

    return {
      ImportDeclaration: (node: es.ImportDeclaration) => {
        const { source } = node;
        const ban = bans.find(({ regExp }) =>
          regExp.test(source.value as string)
        );
        if (ban) {
          context.report({
            messageId: "forbidden",
            data: {
              message: ban.message || defaultMessage,
            },
            node,
          });
        }
      },
    };
  },
});

export = rule;
