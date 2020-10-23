/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import {
  TSESLint as eslint,
  TSESTree as es,
} from "@typescript-eslint/experimental-utils";
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
    fixable: "code",
    messages: {
      forbidden: "Type can be declared using an interface.",
      suggest: "Use an interface instead of a type alias.",
    },
    schema: [],
    type: "problem",
  },
  name: "prefer-interface",
  create: (context) => {
    return {
      "TSTypeAliasDeclaration > TSTypeLiteral": (node: es.Node) => {
        const parent = getParent(node) as es.TSTypeAliasDeclaration;
        function fix(fixer: eslint.RuleFixer) {
          const literal = context.getSourceCode().getText(node);
          return fixer.replaceText(
            parent,
            `interface ${parent.id.name} ${literal}`
          );
        }
        context.report({
          fix,
          messageId: "forbidden",
          node: parent.id,
          suggest: [
            {
              fix,
              messageId: "suggest",
            },
          ],
        });
      },
    };
  },
});

export = rule;
