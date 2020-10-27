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

function isExportNamedDeclaration(
  node: es.Node
): node is es.ExportNamedDeclaration {
  return node.type === "ExportNamedDeclaration";
}

const defaultOptions: {
  allowLocal?: boolean;
}[] = [];

const rule = ruleCreator({
  defaultOptions: defaultOptions,
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
    schema: [
      {
        properties: {
          allowLocal: { type: "boolean" },
        },
        type: "object",
      },
    ],
    type: "suggestion",
  },
  name: "prefer-interface",
  create: (context, unused: typeof defaultOptions) => {
    const [{ allowLocal = false } = {}] = context.options;
    return {
      "TSTypeAliasDeclaration > TSFunctionType": (
        functionTypeNode: es.TSFunctionType
      ) => {
        const typeAliasNode = getParent(
          functionTypeNode
        ) as es.TSTypeAliasDeclaration;
        if (allowLocal && !isExportNamedDeclaration(getParent(typeAliasNode))) {
          return;
        }
        function fix(fixer: eslint.RuleFixer) {
          const typeParameters = typeAliasNode.typeParameters
            ? context.getSourceCode().getText(typeAliasNode.typeParameters)
            : "";
          const params = functionTypeNode.params
            .map((param) => context.getSourceCode().getText(param))
            .join(",");
          const returnType = functionTypeNode.returnType
            ? context
                .getSourceCode()
                .getText(functionTypeNode.returnType)
                .replace(/^\s*=>\s*/, "")
            : "void";
          return fixer.replaceText(
            typeAliasNode,
            `interface ${typeAliasNode.id.name}${typeParameters} { (${params}): ${returnType}; }`
          );
        }
        context.report({
          fix,
          messageId: "forbidden",
          node: typeAliasNode.id,
          suggest: [
            {
              fix,
              messageId: "suggest",
            },
          ],
        });
      },
      "TSTypeAliasDeclaration > TSTypeLiteral": (
        typeLiteralNode: es.TSTypeLiteral
      ) => {
        const typeAliasNode = getParent(
          typeLiteralNode
        ) as es.TSTypeAliasDeclaration;
        if (allowLocal && !isExportNamedDeclaration(getParent(typeAliasNode))) {
          return;
        }
        function fix(fixer: eslint.RuleFixer) {
          const typeParameters = typeAliasNode.typeParameters
            ? context.getSourceCode().getText(typeAliasNode.typeParameters)
            : "";
          const literal = context.getSourceCode().getText(typeLiteralNode);
          return fixer.replaceText(
            typeAliasNode,
            `interface ${typeAliasNode.id.name}${typeParameters} ${literal}`
          );
        }
        context.report({
          fix,
          messageId: "forbidden",
          node: typeAliasNode.id,
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
