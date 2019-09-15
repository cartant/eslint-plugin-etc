/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as tsutils from "tsutils";
import * as ts from "typescript";

export function isDeclaration(identifier: ts.Identifier): boolean {
  const parent = identifier.parent;
  switch (parent.kind) {
    case ts.SyntaxKind.ClassDeclaration:
    case ts.SyntaxKind.ClassExpression:
    case ts.SyntaxKind.InterfaceDeclaration:
    case ts.SyntaxKind.TypeParameter:
    case ts.SyntaxKind.FunctionExpression:
    case ts.SyntaxKind.FunctionDeclaration:
    case ts.SyntaxKind.LabeledStatement:
    case ts.SyntaxKind.JsxAttribute:
    case ts.SyntaxKind.MethodDeclaration:
    case ts.SyntaxKind.MethodSignature:
    case ts.SyntaxKind.PropertySignature:
    case ts.SyntaxKind.TypeAliasDeclaration:
    case ts.SyntaxKind.GetAccessor:
    case ts.SyntaxKind.SetAccessor:
    case ts.SyntaxKind.EnumDeclaration:
    case ts.SyntaxKind.ModuleDeclaration:
      return true;
    case ts.SyntaxKind.VariableDeclaration:
    case ts.SyntaxKind.Parameter:
    case ts.SyntaxKind.PropertyDeclaration:
    case ts.SyntaxKind.EnumMember:
    case ts.SyntaxKind.ImportEqualsDeclaration:
      return (parent as ts.NamedDeclaration).name === identifier;
    case ts.SyntaxKind.PropertyAssignment:
      return (
        (parent as ts.PropertyAssignment).name === identifier &&
        !tsutils.isReassignmentTarget(identifier.parent
          .parent as ts.ObjectLiteralExpression)
      );
    case ts.SyntaxKind.BindingElement:
      // return true for `b` in `const {a: b} = obj"`
      return (
        (parent as ts.BindingElement).name === identifier &&
        (parent as ts.BindingElement).propertyName !== undefined
      );
    default:
      return false;
  }
}

function getCallExpresion(
  node: ts.Expression
): ts.CallLikeExpression | undefined {
  let parent = node.parent;
  if (tsutils.isPropertyAccessExpression(parent) && parent.name === node) {
    node = parent;
    parent = node.parent;
  }
  return tsutils.isTaggedTemplateExpression(parent) ||
    ((tsutils.isCallExpression(parent) || tsutils.isNewExpression(parent)) &&
      parent.expression === node)
    ? parent
    : undefined;
}

export function getDeprecation(
  node: ts.Identifier,
  tc: ts.TypeChecker
): string | undefined {
  const callExpression = getCallExpresion(node);
  if (callExpression !== undefined) {
    const result = getSignatureDeprecation(
      tc.getResolvedSignature(callExpression)
    );
    if (result !== undefined) {
      return result;
    }
  }
  let symbol: ts.Symbol | undefined;
  const parent = node.parent;
  if (parent.kind === ts.SyntaxKind.BindingElement) {
    symbol = tc.getTypeAtLocation(parent.parent).getProperty(node.text);
  } else if (
    (tsutils.isPropertyAssignment(parent) && parent.name === node) ||
    (tsutils.isShorthandPropertyAssignment(parent) &&
      parent.name === node &&
      tsutils.isReassignmentTarget(node))
  ) {
    symbol = tc.getPropertySymbolOfDestructuringAssignment(node);
  } else {
    symbol = tc.getSymbolAtLocation(node);
  }

  if (
    symbol !== undefined &&
    tsutils.isSymbolFlagSet(symbol, ts.SymbolFlags.Alias)
  ) {
    symbol = tc.getAliasedSymbol(symbol);
  }
  if (
    symbol === undefined ||
    // if this is a CallExpression and the declaration is a function or method,
    // stop here to avoid collecting JsDoc of all overload signatures
    (callExpression !== undefined && isFunctionOrMethod(symbol.declarations))
  ) {
    return undefined;
  }
  return getSymbolDeprecation(symbol);
}

function findDeprecationTag(tags: ts.JSDocTagInfo[]): string | undefined {
  for (const tag of tags) {
    if (tag.name === "deprecated") {
      return tag.text === undefined ? "" : tag.text;
    }
  }
  return undefined;
}

function getSymbolDeprecation(symbol: ts.Symbol): string | undefined {
  if (symbol.getJsDocTags !== undefined) {
    return findDeprecationTag(symbol.getJsDocTags());
  }
  // for compatibility with typescript@<2.3.0
  return getDeprecationFromDeclarations(symbol.declarations);
}

function getSignatureDeprecation(signature?: ts.Signature): string | undefined {
  if (signature === undefined) {
    return undefined;
  }
  if (signature.getJsDocTags !== undefined) {
    return findDeprecationTag(signature.getJsDocTags());
  }

  // for compatibility with typescript@<2.3.0
  return signature.declaration === undefined
    ? undefined
    : getDeprecationFromDeclaration(signature.declaration);
}

function getDeprecationFromDeclarations(
  declarations?: ts.Declaration[]
): string | undefined {
  if (declarations === undefined) {
    return undefined;
  }
  let declaration: ts.Node;
  for (declaration of declarations) {
    if (tsutils.isBindingElement(declaration)) {
      declaration = tsutils.getDeclarationOfBindingElement(declaration);
    }
    if (tsutils.isVariableDeclaration(declaration)) {
      declaration = declaration.parent;
    }
    if (tsutils.isVariableDeclarationList(declaration)) {
      declaration = declaration.parent;
    }
    const result = getDeprecationFromDeclaration(declaration);
    if (result !== undefined) {
      return result;
    }
  }
  return undefined;
}

function getDeprecationFromDeclaration(
  declaration: ts.Node
): string | undefined {
  for (const comment of tsutils.getJsDoc(declaration)) {
    if (comment.tags === undefined) {
      continue;
    }
    for (const tag of comment.tags) {
      if (tag.tagName.text === "deprecated") {
        return tag.comment === undefined ? "" : tag.comment;
      }
    }
  }
  return undefined;
}

function isFunctionOrMethod(declarations?: ts.Declaration[]) {
  if (declarations === undefined || declarations.length === 0) {
    return false;
  }
  switch (declarations[0].kind) {
    case ts.SyntaxKind.MethodDeclaration:
    case ts.SyntaxKind.FunctionDeclaration:
    case ts.SyntaxKind.FunctionExpression:
    case ts.SyntaxKind.MethodSignature:
      return true;
    default:
      return false;
  }
}
