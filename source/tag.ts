/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { tsquery } from "@phenomnomnominal/tsquery";
import * as ts from "typescript";

export function findTaggedNames(
  tagName: string,
  program: ts.Program
): Set<string> {
  const taggedNames = new Set<string>();
  program.getSourceFiles().forEach((sourceFile) => {
    if (sourceFile.text.indexOf(`@${tagName}`) === -1) {
      return;
    }
    const nodes = tsquery(
      sourceFile,
      `ClassDeclaration, Constructor, EnumDeclaration, EnumMember, FunctionDeclaration, GetAccessor, InterfaceDeclaration, MethodDeclaration, MethodSignature, PropertyDeclaration, PropertySignature, SetAccessor, TypeAliasDeclaration, VariableDeclaration`
    );
    nodes.forEach((node) => {
      const tags = ts.getJSDocTags(node);
      if (!tags.some((tag) => tag.tagName.text === tagName)) {
        return;
      }
      if (ts.isConstructorDeclaration(node)) {
        const { parent } = node;
        const { name } = parent;
        taggedNames.add(name.text);
      } else {
        const { name } = node as ts.Node & { name: ts.Identifier };
        taggedNames.add(name.text);
      }
    });
  });
  return taggedNames;
}
