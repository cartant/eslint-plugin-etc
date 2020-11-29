/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import {
  TSESLint as eslint,
  TSESTree as es,
} from "@typescript-eslint/experimental-utils";
import { getParent, getParserServices, getTypeServices } from "eslint-etc";
import * as ts from "typescript";
import { ruleCreator } from "../utils";

function isExportNamedDeclaration(
  node: es.Node
): node is es.ExportNamedDeclaration {
  return node.type === "ExportNamedDeclaration";
}

function isTSTypeLiteral(node: es.Node): node is es.TSTypeLiteral {
  return node.type === "TSTypeLiteral";
}

function isTSTypeReference(node: es.Node): node is es.TSTypeReference {
  return node.type === "TSTypeReference";
}

const defaultOptions: {
  allowIntersection?: boolean;
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
    const [
      { allowIntersection = false, allowLocal = false } = {},
    ] = context.options;
    const { esTreeNodeToTSNodeMap } = getParserServices(context);
    let typeChecker: ts.TypeChecker | undefined;
    try {
      ({ typeChecker } = getTypeServices(context));
    } catch (error) {}
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
          const interfaceTypeParameters = typeAliasNode.typeParameters
            ? context.getSourceCode().getText(typeAliasNode.typeParameters)
            : "";
          const functionTypeParameters = functionTypeNode.typeParameters
            ? context.getSourceCode().getText(functionTypeNode.typeParameters)
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
            `interface ${typeAliasNode.id.name}${interfaceTypeParameters} { ${functionTypeParameters}(${params}): ${returnType}; }`
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
      "TSTypeAliasDeclaration > TSIntersectionType": (
        intersectionTypeNode: es.TSIntersectionType
      ) => {
        if (allowIntersection) {
          return;
        }
        const typeAliasNode = getParent(
          intersectionTypeNode
        ) as es.TSTypeAliasDeclaration;
        // https://github.com/microsoft/TypeScript/wiki/Performance#preferring-interfaces-over-intersections
        const literals: es.TSTypeLiteral[] = [];
        const references: es.TSTypeReference[] = [];
        for (const node of intersectionTypeNode.types) {
          if (isTSTypeLiteral(node)) {
            literals.push(node);
          } else if (isTSTypeReference(node)) {
            references.push(node);
          }
        }
        // If there are types other than type literals and interfaces, bail
        // out the rule needs to be sure that the types can be extended.
        if (
          literals.length + references.length !==
          intersectionTypeNode.types.length
        ) {
          return;
        }
        for (const reference of references) {
          const type = typeChecker.getTypeFromTypeNode(
            esTreeNodeToTSNodeMap.get(reference)
          );
          if (!type.isClassOrInterface() || type.isClass()) {
            return;
          }
        }
        if (literals.length > 1) {
          context.report({
            messageId: "forbidden",
            node: typeAliasNode.id,
          });
        } else if (literals.length === 1) {
          // TODO: is there a literal? extend type references and use literal members as the interface body
        } else {
          // TODO: extend type references
        }
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
