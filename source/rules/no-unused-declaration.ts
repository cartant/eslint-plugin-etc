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
    fixable: null,
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
    const [
      { declarations = true, ignored = {}, imports = true } = {},
    ] = context.options;
    const ignoredRegExps: RegExp[] = [];
    Object.entries(ignored).forEach(([key, value]) => {
      if (value !== false) {
        ignoredRegExps.push(new RegExp(key));
      }
    });
    const { esTreeNodeToTSNodeMap, program } = getParserServices(context);

    const jsxFactory =
      program.getCompilerOptions().jsxFactory || "React.createElement";
    const index = jsxFactory.indexOf(".");
    ignoredRegExps.push(
      new RegExp(
        `^${index === -1 ? jsxFactory : jsxFactory.substring(0, index)}$`
      )
    );

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
        if (isDeclaration(parent)) {
          return false;
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
      switch (parent.type) {
        case "ArrayPattern":
        case "ObjectPattern":
          return isParameter(parent);
        case "ArrowFunctionExpression":
        case "FunctionDeclaration":
        case "FunctionExpression":
        case "TSDeclareFunction":
          return parent.params.includes(node as es.Identifier);
        case "Property":
          return isParameter(getParent(parent));
        case "RestElement":
          return isParameter(parent);
        case "TSParameterProperty":
          return true;
        default:
          return false;
      }
    };

    const isDeclaration = (node: es.Node): boolean => {
      const parent = getParent(node);
      if (!parent) {
        return false;
      }
      switch (parent.type) {
        case "ArrayPattern":
        case "ObjectPattern":
          return isDeclaration(parent);
        case "ArrowFunctionExpression":
          return node !== parent.body;
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

    const isRestElementSibling = (variable: eslint.Scope.Variable) => {
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
    };

    const isTSParameterProperty = (identifier: es.Identifier) => {
      const parent = getParent(identifier);
      return parent && parent.type === "TSParameterProperty";
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
      if (ignoredRegExps.some((regExp) => regExp.test(identifier.name))) {
        return false;
      }
      if (isParameter(identifier)) {
        return false;
      }
      if (isTSParameterProperty(identifier)) {
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

    const check = (scope: eslint.Scope.Scope) => {
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
          data: { name: name.text },
          messageId: "forbidden",
          node: node.id,
        });
      }
    };

    return {
      JSXOpeningElement: (node: es.Node) => {},
      Program: () => check(context.getScope()),
      TSClassImplements: (node: es.Node) => {},
      TSInterfaceDeclaration: checkTypeDeclaration,
      TSTypeAliasDeclaration: checkTypeDeclaration,
      TSTypeReference: (node: es.Node) => {},
    };
  },
});

export = rule;
