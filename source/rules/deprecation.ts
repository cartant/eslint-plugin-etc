/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { Rule } from "eslint";
import { getParserServices, getParent } from "eslint-etc";
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
    const ignores: RegExp[] = [];
    Object.entries(config).forEach(([key, value]) => {
      if (value === false) {
        ignores.push(new RegExp(key));
      }
    });
    const { esTreeNodeToTSNodeMap, program } = getParserServices(context);
    const typeChecker = program.getTypeChecker();
    return {
      Identifier: (node: es.Identifier) => {
        switch (getParent(node).type) {
          case "ExportSpecifier":
          case "ImportDefaultSpecifier":
          case "ImportNamespaceSpecifier":
          case "ImportSpecifier":
            return;
        }
        const identifier = esTreeNodeToTSNodeMap.get(node) as ts.Identifier;
        if (
          !isDeclaration(identifier) &&
          !ignores.some(ignore => ignore.test(identifier.text))
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
