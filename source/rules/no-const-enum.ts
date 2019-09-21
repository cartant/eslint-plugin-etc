/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { Rule } from "eslint";
import { getLoc, getParserServices } from "eslint-etc";
import * as es from "estree";
import * as tsutils from "tsutils";
import * as ts from "typescript";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "General",
      description: "Forbids the use of `const enum`.",
      recommended: false
    },
    fixable: null,
    messages: {
      forbidden: "`const enum` is forbidden."
    },
    schema: [
      {
        properties: {
          allowLocal: { type: "boolean" }
        },
        type: "object"
      }
    ]
  },
  create: context => ({
    TSEnumDeclaration: (node: es.Node) => {
      const [config = {}] = context.options;
      const { allowLocal = false } = config;
      const { esTreeNodeToTSNodeMap } = getParserServices(context);
      const enumDeclaration = esTreeNodeToTSNodeMap.get(
        node
      ) as ts.EnumDeclaration;
      if (
        allowLocal &&
        !tsutils.hasModifier(
          enumDeclaration.modifiers,
          ts.SyntaxKind.ExportKeyword
        )
      ) {
        return;
      }
      if (
        !tsutils.hasModifier(
          enumDeclaration.modifiers,
          ts.SyntaxKind.ConstKeyword
        )
      ) {
        return;
      }
      context.report({
        messageId: "forbidden",
        loc: getLoc(enumDeclaration.name)
      });
    }
  })
};

export = rule;
