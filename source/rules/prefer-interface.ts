/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import {
  TSESLint as eslint,
  TSESTree as es,
} from "@typescript-eslint/experimental-utils";
import {
  getParent,
  getParserServices,
  getTypeServices,
  isExportNamedDeclaration,
  isIdentifier,
  isTSTypeLiteral,
  isTSTypeReference,
} from "eslint-etc";
import { ruleCreator } from "../utils";

const defaultOptions: readonly {
  allowIntersection?: boolean;
  allowLocal?: boolean;
}[] = [];

const rule = ruleCreator({
  defaultOptions: defaultOptions,
  meta: {
    docs: {
      description: "Forbids type aliases where interfaces can be used.",
      recommended: false,
    },
    fixable: "code",
    hasSuggestions: true,
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
    const [{ allowIntersection = true, allowLocal = false } = {}] =
      context.options;

    function formatTypeParameters(
      typeParameters?:
        | es.TSTypeParameterDeclaration
        | es.TSTypeParameterInstantiation
    ): string {
      return typeParameters
        ? context.getSourceCode().getText(typeParameters)
        : "";
    }

    function formatTypeReferences(
      typeReferences: es.TSTypeReference[]
    ): string {
      return typeReferences
        .map((typeReference) => {
          if (!isIdentifier(typeReference.typeName)) {
            throw new Error("Expected typeName to be an identifier.");
          }
          const parameters = formatTypeParameters(typeReference.typeParameters);
          return `${typeReference.typeName.name}${parameters}`;
        })
        .join(", ");
    }

    return {
      "TSTypeAliasDeclaration > TSFunctionType": (
        functionTypeNode: es.TSFunctionType
      ) => {
        const typeAliasNode = getParent(
          functionTypeNode
        ) as es.TSTypeAliasDeclaration;
        if (
          allowLocal &&
          !isExportNamedDeclaration(getParent(typeAliasNode) as es.Node)
        ) {
          return;
        }
        function fix(fixer: eslint.RuleFixer) {
          const interfaceTypeParameters = formatTypeParameters(
            typeAliasNode.typeParameters
          );
          const functionTypeParameters = formatTypeParameters(
            functionTypeNode.typeParameters
          );
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
        const { esTreeNodeToTSNodeMap } = getParserServices(context);
        const { typeChecker } = getTypeServices(context);
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
          // It seems like it ought to be possible to use the isClass and
          // isClassOrInterface methods here, but the isClassOrInterface method
          // return false for generic interfaces.
          if (type.isUnion()) {
            return;
          }
        }
        if (literals.length > 1) {
          return;
        }
        let fix: (fixer: eslint.RuleFixer) => any;
        if (literals.length === 1) {
          fix = function (fixer: eslint.RuleFixer) {
            const parameters = formatTypeParameters(
              typeAliasNode.typeParameters
            );
            const bases = formatTypeReferences(references);
            const literal = context.getSourceCode().getText(literals[0]);
            return fixer.replaceText(
              typeAliasNode,
              `interface ${typeAliasNode.id.name}${parameters} extends ${bases} ${literal}`
            );
          };
        } else {
          fix = function (fixer: eslint.RuleFixer) {
            const parameters = formatTypeParameters(
              typeAliasNode.typeParameters
            );
            const bases = formatTypeReferences(references);
            return fixer.replaceText(
              typeAliasNode,
              `interface ${typeAliasNode.id.name}${parameters} extends ${bases} {}`
            );
          };
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
        if (
          allowLocal &&
          !isExportNamedDeclaration(getParent(typeAliasNode) as es.Node)
        ) {
          return;
        }
        function fix(fixer: eslint.RuleFixer) {
          const parameters = formatTypeParameters(typeAliasNode.typeParameters);
          const literal = context.getSourceCode().getText(typeLiteralNode);
          return fixer.replaceText(
            typeAliasNode,
            `interface ${typeAliasNode.id.name}${parameters} ${literal}`
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
