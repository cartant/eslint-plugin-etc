/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { tsquery } from "@phenomnomnominal/tsquery";
import {
  TSESLint as eslint,
  TSESTree as es,
} from "@typescript-eslint/experimental-utils";
import {
  getParent,
  getParserServices,
  isIdentifier,
  isObjectPattern,
  isRestElement,
  isVariableDeclarator,
} from "eslint-etc";
import * as tsutils from "tsutils";
import * as ts from "typescript";
import { ruleCreator } from "../utils";

const defaultOptions: {
  declarations?: boolean;
  ignored?: Record<string, boolean>;
  imports?: boolean;
}[] = [];

const rule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      category: "Best Practices",
      description: "Forbids unused declarations.",
      recommended: false,
    },
    fixable: undefined,
    messages: {
      forbidden: `"{{name}}" is not used; unused declarations are forbidden.`,
    },
    schema: [
      {
        properties: {
          declarations: { type: "boolean" },
          ignored: { type: "object" },
          imports: { type: "boolean" },
        },
        type: "object",
      },
    ],
    type: "problem",
  },
  name: "no-unused-declaration",
  create: (context, unused: typeof defaultOptions) => {
    const { esTreeNodeToTSNodeMap, program } = getParserServices(context);
    const [
      { declarations = true, ignored = {}, imports = true } = {},
    ] = context.options;
    const ignoredRegExps: RegExp[] = [];
    Object.entries(ignored).forEach(([key, value]) => {
      if (value !== false) {
        ignoredRegExps.push(new RegExp(key));
      }
    });

    const jsxFactory =
      program.getCompilerOptions().jsxFactory || "React.createElement";
    const index = jsxFactory.indexOf(".");
    ignoredRegExps.push(
      new RegExp(
        `^${index === -1 ? jsxFactory : jsxFactory.substring(0, index)}$`
      )
    );

    const moduleDeclarations: es.Node[] = [];

    function check(scope: eslint.Scope.Scope, comments?: es.Comment[]) {
      if (comments) {
        comments.some((comment) => {
          const match = comment.value.match(/@jsx\s+(\w+)/);
          if (match) {
            ignoredRegExps.push(new RegExp(`^${match[1]}$`));
            return true;
          }
        });
      }
      const type: string = scope.type;
      if (type === "enum") {
        return;
      }
      if (!["class", "global"].includes(type)) {
        const { variables } = scope;
        variables.forEach((variable) => {
          const { identifiers, name, references } = variable;
          if (identifiers.every(shouldCheckReferences)) {
            if (isRestElementSibling(variable)) {
              return;
            }
            const filtered = references.filter((reference) => {
              const { identifier } = reference;
              return shouldCountReference(identifier);
            });
            if (filtered.length > 0) {
              return;
            }
            const nodes = tsquery(
              esTreeNodeToTSNodeMap.get(scope.block),
              [
                `HeritageClause Identifier[text="${name}"]`,
                `JsxOpeningElement[tagName.text="${name}"]`,
                `JsxOpeningElement[tagName.expression.text="${name}"]`,
                `JsxSelfClosingElement[tagName.text="${name}"]`,
                `JsxSelfClosingElement[tagName.expression.text="${name}"]`,
                `TypeReference[typeName.text="${name}"]`,
                `TypeReference[typeName.left.text="${name}"]`,
              ].join(",")
            );
            if (nodes.length > 0) {
              return;
            }
            identifiers.forEach((identifier) => {
              const specifier = getImportSpecifier(identifier);
              if (specifier) {
                // TODO:
                // console.log(
                //   "fix",
                //   context.getSourceCode().getText(specifier)
                // );
              }
              context.report({
                data: { name: identifier.name },
                messageId: "forbidden",
                node: identifier,
              });
            });
          }
        });
      }
      scope.childScopes.forEach((childScope) => check(childScope));
    }

    function checkTypeDeclaration(node: es.Node & { id: es.Identifier }) {
      if (moduleDeclarations.length > 0) {
        return false;
      }
      if (!declarations) {
        return;
      }
      const typeDeclaration = esTreeNodeToTSNodeMap.get(node) as
        | ts.InterfaceDeclaration
        | ts.TypeAliasDeclaration;
      const { modifiers, name, parent } = typeDeclaration;
      if (tsutils.hasModifier(modifiers, ts.SyntaxKind.ExportKeyword)) {
        return;
      }
      const nodes = tsquery(
        parent,
        `TypeReference[typeName.text="${name.text}"], HeritageClause Identifier[name="${name.text}"]`
      );
      if (nodes.length === 0) {
        context.report({
          data: { name: name.text },
          messageId: "forbidden",
          node: node.id,
        });
      }
    }

    function getImportSpecifier(node: es.Node) {
      const parent = getParent(node);
      switch (parent.type) {
        case "ImportDefaultSpecifier":
        case "ImportNamespaceSpecifier":
        case "ImportSpecifier":
          return parent;
        default:
          return undefined;
      }
    }

    function isAssigneeIdentifier(identifier: es.Identifier) {
      const parent = getParent(identifier);
      return (
        parent.type === "AssignmentExpression" && identifier === parent.left
      );
    }

    function isCaughtErrorIdentifier(identifier: es.Identifier) {
      const parent = getParent(identifier);
      return parent.type === "CatchClause";
    }

    function isDeclarationIdentifier(identifier: es.Node): boolean {
      const parent = getParent(identifier);
      if (!parent) {
        return false;
      }
      switch (parent.type) {
        case "ArrayPattern":
        case "ObjectPattern":
          return isDeclarationIdentifier(parent);
        case "ArrowFunctionExpression":
          return identifier !== parent.body;
        case "ClassDeclaration":
        case "FunctionDeclaration":
          return true;
        case "VariableDeclarator":
          return identifier !== parent.init;
        case "Property":
          return isDeclarationIdentifier(getParent(parent));
        case "RestElement":
          return isDeclarationIdentifier(parent);
        default:
          return isParameterIdentifier(identifier);
      }
    }

    function isDeclaredIdentifier(identifier: es.Node) {
      let parent = getParent(identifier);
      while (parent) {
        switch (parent.type) {
          case "ClassDeclaration":
          case "TSDeclareFunction":
          case "VariableDeclaration":
            return parent.declare;
          default:
            break;
        }
        parent = getParent(parent);
      }
      return false;
    }

    function isExportedIdentifier(identifier: es.Node) {
      let parent = getParent(identifier);
      while (parent) {
        if (parent.type === "ExportNamedDeclaration") {
          return true;
        }
        if (isDeclarationIdentifier(parent)) {
          return false;
        }
        parent = getParent(parent);
      }
      return false;
    }

    function isImportedIdentifier(identifier: es.Node) {
      const specifier = getImportSpecifier(identifier);
      return specifier !== undefined;
    }

    function isFunctionExpressionIdentifier(identifier: es.Identifier) {
      const parent = getParent(identifier);
      return parent.type === "FunctionExpression";
    }

    function isParameterIdentifier(identifier: es.Node): boolean {
      const parent = getParent(identifier);
      switch (parent.type) {
        case "ArrayPattern":
        case "ObjectPattern":
          return isParameterIdentifier(parent);
        case "ArrowFunctionExpression":
        case "FunctionDeclaration":
        case "FunctionExpression":
        case "TSDeclareFunction":
          return parent.params.includes(identifier as es.Identifier);
        case "Property":
          return isParameterIdentifier(getParent(parent));
        case "RestElement":
          return isParameterIdentifier(parent);
        case "TSParameterProperty":
          return true;
        default:
          return false;
      }
    }

    function isRestElementSibling(variable: eslint.Scope.Variable) {
      const [def] = variable.defs;
      if (!def) {
        return false;
      }
      const { node } = def;
      if (!isVariableDeclarator(node) || !isObjectPattern(node.id)) {
        return false;
      }
      return node.id.properties.some(
        (property) =>
          isRestElement(property) &&
          isIdentifier(property.argument) &&
          property.argument.name !== variable.name
      );
    }

    function shouldCheckReferences(identifier: es.Identifier) {
      if (moduleDeclarations.length > 0) {
        return false;
      }
      if (!declarations && !isImportedIdentifier(identifier)) {
        return false;
      }
      if (!imports && isImportedIdentifier(identifier)) {
        return false;
      }
      if (
        isExportedIdentifier(identifier) ||
        isDeclaredIdentifier(identifier)
      ) {
        return false;
      }
      if (ignoredRegExps.some((regExp) => regExp.test(identifier.name))) {
        return false;
      }
      if (isParameterIdentifier(identifier)) {
        return false;
      }
      if (isFunctionExpressionIdentifier(identifier)) {
        return false;
      }
      if (isCaughtErrorIdentifier(identifier)) {
        return false;
      }
      return true;
    }

    function shouldCountReference(identifier: es.Identifier) {
      if (isDeclarationIdentifier(identifier)) {
        return false;
      }
      if (isAssigneeIdentifier(identifier)) {
        return false;
      }
      return true;
    }

    return {
      Program: (node: es.Program) => check(context.getScope(), node.comments),
      TSInterfaceDeclaration: checkTypeDeclaration,
      TSModuleDeclaration: (node: es.Node) => moduleDeclarations.push(node),
      "TSModuleDeclaration:exit": () => moduleDeclarations.pop(),
      TSTypeAliasDeclaration: checkTypeDeclaration,
    };
  },
});

export = rule;
