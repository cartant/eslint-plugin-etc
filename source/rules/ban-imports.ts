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
            description: "Forbids using the configured import locations.",
            recommended: false
        },
        fixable: null,
        messages: {
            forbidden: "This import location is forbidden."
        },
        schema: [{
            type: "object"
        }]
    },
    create: context => {
        const [config = {}] = context.options;
        const forbiddens: RegExp[] = [];
        Object.entries(config).forEach(([key, value]) => {
            if (value !== false) {
                forbiddens.push(new RegExp(key));
            }
        });
        return {
            ImportDeclaration: (node: es.ImportDeclaration) => {
                const { source } = node;
                if (forbiddens.some(forbidden => forbidden.test(source.value as string))) {
                    context.report({
                        messageId: "forbidden",
                        node
                    });
                }
            }
        };
    }
};

export = rule;
