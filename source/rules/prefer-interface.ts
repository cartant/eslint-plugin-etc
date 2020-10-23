/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { getParent } from "eslint-etc";
import { ruleCreator } from "../utils";

const rule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      category: "Best Practices",
      description: "Forbids type aliases where interfaces can be used.",
      recommended: false,
    },
    fixable: undefined,
    messages: {
      forbidden: "Use an interface instead of a type alias.",
    },
    schema: [],
    type: "problem",
  },
  name: "prefer-interface",
  create: (context) => {
    return {
      "TSTypeAliasDeclaration > TSTypeLiteral": (node: es.Node) => {
        const parent = getParent(node) as es.TSTypeAliasDeclaration;
        context.report({
          messageId: "forbidden",
          node: parent.id,
        });
      },
    };
  },
});

export = rule;
