/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { Rule } from "eslint";
import * as es from "estree";
import * as ts from "typescript";
import { getLoc, getParserServices } from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "General",
      description: "Forbids the use of `enum`.",
      recommended: false
    },
    fixable: null,
    messages: {
      forbidden: "`enum` is forbidden."
    }
  },
  create: context => ({
    TSEnumDeclaration: (node: es.Node) => {
      const { esTreeNodeToTSNodeMap } = getParserServices(context);
      const enumDeclaration = esTreeNodeToTSNodeMap.get(
        node
      ) as ts.EnumDeclaration;
      context.report({
        messageId: "forbidden",
        loc: getLoc(enumDeclaration.name)
      });
    }
  })
};

export = rule;
