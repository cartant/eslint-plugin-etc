/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { getLoc, getParserServices } from "eslint-etc";
import * as tsutils from "tsutils";
import * as ts from "typescript";
import { ruleCreator } from "../utils";

const defaultOptions: {
  allowLocal?: boolean;
}[] = [];

const rule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      category: "Best Practices",
      description: "Forbids the use of `const enum`.",
      recommended: false,
    },
    fixable: undefined,
    messages: {
      forbidden: "`const enum` is forbidden.",
    },
    schema: [
      {
        properties: {
          allowLocal: { type: "boolean" },
        },
        type: "object",
      },
    ],
    type: "problem",
  },
  name: "no-const-enum",
  create: (context, unused: typeof defaultOptions) => ({
    TSEnumDeclaration: (node: es.Node) => {
      const [{ allowLocal = false } = {}] = context.options;
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
        loc: getLoc(enumDeclaration.name),
      });
    },
  }),
});

export = rule;
