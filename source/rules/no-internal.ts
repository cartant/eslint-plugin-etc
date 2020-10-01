/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { getParent, getParserServices } from "eslint-etc";
import * as ts from "typescript";
import { findTaggedNames } from "../tag";
import { getTag, isDeclaration } from "../tslint-tag";
import { ruleCreator } from "../utils";

// https://api-extractor.com/pages/tsdoc/tag_internal/

const internalNamesByProgram = new WeakMap<ts.Program, Set<string>>();

const defaultOptions: {
  ignored?: Record<string, string>;
}[] = [];

const rule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      category: "Best Practices",
      description: "Forbids the use of internal APIs.",
      recommended: false,
    },
    fixable: undefined,
    messages: {
      forbidden: `"{{name}}" is internal.`,
    },
    schema: [
      {
        properties: {
          ignored: { type: "object" },
        },
        type: "object",
      },
    ],
    type: "problem",
  },
  name: "no-internal",
  create: (context, unused: typeof defaultOptions) => {
    const [{ ignored = {} } = {}] = context.options;
    const ignoredNameRegExps: RegExp[] = [];
    const ignoredPathRegExps: RegExp[] = [];
    Object.entries(ignored).forEach(([key, value]) => {
      switch (value) {
        case "name":
          ignoredNameRegExps.push(new RegExp(key));
          break;
        case "path":
          ignoredPathRegExps.push(new RegExp(key));
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
    let internalNames: Set<string>;
    if (internalNamesByProgram.has(program)) {
      internalNames = internalNamesByProgram.get(program);
    } else {
      internalNames = findTaggedNames("internal", program);
      internalNamesByProgram.set(program, internalNames);
    }
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
        if (!internalNames.has(identifier.text)) {
          return;
        }
        if (isDeclaration(identifier)) {
          return;
        }
        if (
          ignoredNameRegExps.some((regExp) => regExp.test(identifier.text)) ||
          ignoredPathRegExps.some((regExp) => regExp.test(getPath(identifier)))
        ) {
          return;
        }
        const comment = getTag("internal", identifier, typeChecker);
        if (comment !== undefined) {
          context.report({
            data: { comment, name: identifier.text },
            messageId: "forbidden",
            node,
          });
        }
      },
    };
  },
});

export = rule;
