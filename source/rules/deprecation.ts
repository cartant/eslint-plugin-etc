/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { Rule } from "eslint";
import { getParent, getParserServices } from "eslint-etc";
import * as es from "estree";
import * as ts from "typescript";
import { getDeprecation, isDeclaration } from "../tslint-deprecation";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "General",
      description: "Forbids the use of deprecated APIs.",
      recommended: false
    },
    fixable: null,
    messages: {
      forbidden: "Deprecated: {{comment}}"
    },
    schema: [
      {
        type: "object"
      }
    ]
  },
  create: context => {
    const [config = {}] = context.options;
    const ignoredNames: RegExp[] = [];
    const ignoredPaths: RegExp[] = [];
    Object.entries(config).forEach(([key, value]) => {
      switch (value) {
        case "name":
          ignoredNames.push(new RegExp(key));
          break;
        case "path":
          ignoredPaths.push(new RegExp(key));
          break;
        default:
          break;
      }
    });
    const { esTreeNodeToTSNodeMap, program } = getParserServices(context);
    const typeChecker = program.getTypeChecker();
    const getPath = (identifier: ts.Identifier) => {
      const type = typeChecker.getTypeAtLocation(identifier);
      return typeChecker.getFullyQualifiedName(type.symbol);
    };
    return {
      Identifier: (node: es.Identifier) => {
        switch (getParent(node).type) {
          case "ExportSpecifier":
          case "ImportDefaultSpecifier":
          case "ImportNamespaceSpecifier":
          case "ImportSpecifier":
            return;
          default:
            break;
        }
        const identifier = esTreeNodeToTSNodeMap.get(node) as ts.Identifier;
        if (
          !isDeclaration(identifier) &&
          !ignoredNames.some(ignored => ignored.test(identifier.text)) &&
          !ignoredPaths.some(ignored => ignored.test(getPath(identifier)))
        ) {
          const deprecation = getDeprecation(identifier, typeChecker);
          if (deprecation !== undefined) {
            context.report({
              data: { comment: deprecation },
              messageId: "forbidden",
              node
            });
          }
        }
      }
    };
  }
};

export = rule;
