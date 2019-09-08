/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { Rule } from "eslint";
import * as es from "estree";
import * as ts from "typescript";

export function getLoc(node: ts.Node): es.SourceLocation {
  const sourceFile = node.getSourceFile();
  const start = ts.getLineAndCharacterOfPosition(sourceFile, node.getStart());
  const end = ts.getLineAndCharacterOfPosition(sourceFile, node.getEnd());
  return {
    start: {
      line: start.line + 1,
      column: start.character
    },
    end: {
      line: end.line + 1,
      column: end.character
    }
  };
}

export function getParent(node: es.Node): es.Node | undefined {
  return (node as any).parent;
}

export function getParserServices(
  context: Rule.RuleContext
): {
  esTreeNodeToTSNodeMap: Map<es.Node, ts.Node>;
  program: ts.Program;
} {
  if (
    !context.parserServices ||
    !context.parserServices.program ||
    !context.parserServices.esTreeNodeToTSNodeMap
  ) {
    throw new Error(
      "This rule requires you to use `@typescript-eslint/parser` and to specify a `project` in `parserOptions`."
    );
  }
  return context.parserServices;
}

export function isCallExpression(node: es.Node): node is es.CallExpression {
  return node.type === "CallExpression";
}
