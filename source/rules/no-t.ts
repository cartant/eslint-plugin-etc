/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { Rule } from "eslint";
import * as es from "estree";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "General",
      description: "Forbids single-character type parameters.",
      recommended: false
    },
    fixable: null,
    messages: {
      forbidden: "Single-character type parameters are forbidden."
    }
  },
  create: context => ({
    "TSTypeParameter > Identifier[name=/^.$/]": (node: es.Identifier) =>
      context.report({
        messageId: "forbidden",
        node
      })
  })
};

export = rule;
