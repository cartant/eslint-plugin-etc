/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { findParent, getParserServices } from "eslint-etc";
import { getTagsFromDeclaration } from "../tslint-tag";
import { ruleCreator } from "../utils";

const rule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      category: "Best Practices",
      description:
        "Forbids internal APIs that are not prefixed with underscores.",
      recommended: false,
    },
    fixable: undefined,
    messages: {
      forbidden: "Internal APIs not prefixed with underscores are forbidden.",
    },
    schema: [],
    type: "problem",
  },
  name: "underscore-internal",
  create: (context) => {
    const { esTreeNodeToTSNodeMap } = getParserServices(context);
    return {
      "VariableDeclarator[id.name=/^[^_]/]": (node: es.VariableDeclarator) => {
        const tsNode = esTreeNodeToTSNodeMap.get(
          findParent(node, "VariableDeclaration") as es.VariableDeclaration
        );
        const tags = getTagsFromDeclaration("internal", tsNode);
        if (tags.length > 0) {
          context.report({
            messageId: "forbidden",
            node: node.id,
          });
        }
      },
    };
  },
});

export = rule;
