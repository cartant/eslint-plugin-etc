/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { Rule } from "eslint";
import { getLoc, getParserServices } from "eslint-etc";
import * as es from "estree";
import * as ts from "typescript";

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
    const { esTreeNodeToTSNodeMap } = getParserServices(context);
    const reportIfDeprecated = (node: es.Node) => {
      const declaration = esTreeNodeToTSNodeMap.get(node) as ts.Node & {
        name: ts.Identifier;
      };
      const tags = ts.getJSDocTags(declaration);
      const [tag] = tags.filter(tag => tag.tagName.getText() === "deprecated");
      if (!tag) {
        return;
      }
      const { name } = declaration;
      const text = name.getText();
      if (ignores.some(ignore => ignore.test(text))) {
        return;
      }
      context.report({
        data: {
          comment: tag.comment
        },
        loc: getLoc(name),
        messageId: "forbidden"
      });
    };
    return {
      ClassDeclaration: reportIfDeprecated,
      ClassProperty: reportIfDeprecated,
      FunctionDeclaration: reportIfDeprecated,
      MethodDefinition: reportIfDeprecated,
      TSCallSignatureDeclaration: reportIfDeprecated,
      TSEnumDeclaration: reportIfDeprecated,
      TSEnumMember: reportIfDeprecated,
      TSInterfaceDeclaration: reportIfDeprecated,
      TSMethodSignature: reportIfDeprecated,
      TSPropertySignature: reportIfDeprecated,
      TSTypeAliasDeclaration: reportIfDeprecated,
      VariableDeclarator: reportIfDeprecated
    };
  }
};

export = rule;
