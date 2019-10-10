/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { tsquery } from "@phenomnomnominal/tsquery";
import { Rule, Scope } from "eslint";
import { getParent, getParserServices } from "eslint-etc";
import * as es from "estree";
import * as tsutils from "tsutils";
import * as ts from "typescript";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "General",
      description: "Forbids unused declarations.",
      recommended: false
    },
    fixable: null,
    messages: {
      forbidden: "Unused declarations are forbidden."
    },
    schema: [
      {
        properties: {
          declarations: { type: "boolean" },
          ignored: { type: "object" },
          imports: { type: "boolean" }
        },
        type: "object"
      }
    ]
  },
  create: context => {
    const [config = {}] = context.options;
    const { declarations = true, ignored = {}, imports = true } = config;
    const ignoredRegExps: RegExp[] = [];
    Object.entries(ignored).forEach(([key, value]) => {
      if (value !== false) {
        ignoredRegExps.push(new RegExp(key));
      }
    });
    const { esTreeNodeToTSNodeMap } = getParserServices(context);

    const isAssignee = (identifier: es.Identifier) => {
      const parent = getParent(identifier);
      return (
        parent.type === "AssignmentExpression" && identifier === parent.left
      );
    };

    const isExported = (node: es.Node) => {
      let parent = getParent(node);
      while (parent) {
        if (parent.type === "ExportNamedDeclaration") {
          return true;
        }
        parent = getParent(parent);
      }
      return false;
    };

    const getImportSpecifier = (node: es.Node) => {
      const parent = getParent(node);
      switch (parent.type) {
        case "ImportDefaultSpecifier":
        case "ImportNamespaceSpecifier":
        case "ImportSpecifier":
          return parent;
        default:
          return undefined;
      }
    };

    const isImported = (node: es.Node) => {
      const specifier = getImportSpecifier(node);
      return specifier !== undefined;
    };

    const isParameter = (node: es.Node): boolean => {
      const parent = getParent(node);
      switch (parent.type as string) {
        case "ArrayPattern":
        case "ObjectPattern":
          return isParameter(parent);
        case "ArrowFunctionExpression":
        case "FunctionDeclaration":
        case "TSDeclareFunction":
          return (parent as es.FunctionDeclaration).params.includes(
            node as es.Identifier
          );
        case "Property":
          return isParameter(getParent(parent));
        case "RestElement":
          return isParameter(parent);
        default:
          return false;
      }
    };

    const isDeclaration = (node: es.Node): boolean => {
      const parent = getParent(node);
      switch (parent.type) {
        case "ArrayPattern":
        case "ObjectPattern":
          return isDeclaration(parent);
        case "ArrowFunctionExpression":
        case "ClassDeclaration":
        case "FunctionDeclaration":
          return true;
        case "VariableDeclarator":
          return node !== parent.init;
        case "Property":
          return isDeclaration(getParent(parent));
        case "RestElement":
          return isDeclaration(parent);
        default:
          return isParameter(node);
      }
    };

    const shouldCheckReferences = (identifier: es.Identifier) => {
      if (!declarations && !isImported(identifier)) {
        return false;
      }
      if (!imports && isImported(identifier)) {
        return false;
      }
      if (isExported(identifier)) {
        return false;
      }
      if (ignoredRegExps.some(regExp => regExp.test(identifier.name))) {
        return false;
      }
      if (isParameter(identifier)) {
        return false;
      }
      return true;
    };

    const shouldCountReference = (identifier: es.Identifier) => {
      if (isDeclaration(identifier)) {
        return false;
      }
      if (isAssignee(identifier)) {
        return false;
      }
      return true;
    };

    const check = (scope: Scope.Scope) => {
      const type: string = scope.type;
      if (type === "enum") {
        return;
      }
      if (!["class", "global"].includes(type)) {
        const { variables } = scope;
        variables.forEach(variable => {
          const { identifiers, references } = variable;
          if (identifiers.every(shouldCheckReferences)) {
            const filtered = references.filter(reference => {
              const { identifier } = reference;
              return shouldCountReference(identifier);
            });
            if (filtered.length > 0) {
              return;
            }
            const jsxElements = tsquery(
              esTreeNodeToTSNodeMap.get(scope.block),
              `JsxOpeningElement[tagName.text="${variable.name}"]`
            );
            if (jsxElements.length > 0) {
              return;
            }
            const typeReferences = tsquery(
              esTreeNodeToTSNodeMap.get(scope.block),
              `TypeReference[typeName.text="${variable.name}"],TypeReference[typeName.left.text="${variable.name}"]`
            );
            if (typeReferences.length > 0) {
              return;
            }
            const heritageClauses = tsquery(
              esTreeNodeToTSNodeMap.get(scope.block),
              `HeritageClause Identifier[text="${variable.name}"]`
            );
            if (heritageClauses.length > 0) {
              return;
            }
            identifiers.forEach(identifier => {
              const specifier = getImportSpecifier(identifier);
              if (specifier) {
                // TODO:
                // console.log(
                //   "fix",
                //   context.getSourceCode().getText(specifier)
                // );
              }
              context.report({
                messageId: "forbidden",
                node: identifier
              });
            });
          }
        });
      }
      scope.childScopes.forEach(check);
    };

    const checkTypeDeclaration = (node: es.Node & { id: es.Identifier }) => {
      const typeDeclaration = esTreeNodeToTSNodeMap.get(node) as
        | ts.InterfaceDeclaration
        | ts.TypeAliasDeclaration;
      const { modifiers, name, parent } = typeDeclaration;
      if (tsutils.hasModifier(modifiers, ts.SyntaxKind.ExportKeyword)) {
        return;
      }
      const typeReferences = tsquery(
        parent,
        `TypeReference[typeName.text="${name.text}"]`
      );
      if (typeReferences.length === 0) {
        context.report({
          messageId: "forbidden",
          node: node.id
        });
      }
    };

    return {
      Program: () => check(context.getScope()),
      TSInterfaceDeclaration: checkTypeDeclaration,
      TSTypeAliasDeclaration: checkTypeDeclaration
    };
  }
};

export = rule;
