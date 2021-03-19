/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { ruleCreator } from "../utils";

const defaultOptions: readonly {
  prefix?: string;
}[] = [];

const rule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      category: "Best Practices",
      description: "Forbids single-character type parameters.",
      recommended: false,
    },
    fixable: undefined,
    messages: {
      forbidden: `Single-character type parameters are forbidden. Choose a more descriptive name for "{{name}}"`,
      prefix: `Type parameter "{{name}}" does not have prefix "{{prefix}}"`,
    },
    schema: [
      {
        properties: {
          prefix: { type: "string" },
        },
        type: "object",
      },
    ],
    type: "problem",
  },
  name: "no-t",
  create: (context, unused: typeof defaultOptions) => {
    const [{ prefix = "" } = {}] = context.options;
    return {
      "TSTypeParameter > Identifier[name=/^.$/]": (node: es.Identifier) =>
        context.report({
          data: { name: node.name },
          messageId: "forbidden",
          node,
        }),
      "TSTypeParameter > Identifier[name=/^.{2,}$/]": (node: es.Identifier) => {
        const { name } = node;
        if (prefix && name.indexOf(prefix) !== 0) {
          context.report({
            data: { name, prefix },
            messageId: "prefix",
            node,
          });
        }
      },
    };
  },
});

export = rule;
