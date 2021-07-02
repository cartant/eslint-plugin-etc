/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { ruleCreator } from "../utils";

const rule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      category: "Best Practices",
      description: "Forbids commented-out code.",
      recommended: false,
    },
    fixable: undefined,
    messages: {
      forbidden: "Commented-out code is forbidden.",
    },
    schema: [],
    type: "problem",
  },
  name: "no-commented-out-code",
  create: (context) => {
    const { parse } = require(context.parserPath);
    const { project, ...parserOptions } = context.parserOptions;
    const sourceCode = context.getSourceCode();
    return {
      Program: () => {
        const comments = context.getSourceCode().getAllComments();
        const blocks = toBlocks(comments);
        for (const block of blocks) {
          const { content, loc } = block;
          // Comments for collapsible regions can be parsed as private
          // properties within class declarations, but they're not
          // commented-out code.
          if (isRegionComment(content)) {
            continue;
          }

          // If the comment can be parsed as a trivial program, it's probably
          // not commented-out code.
          try {
            const program = parse(content, parserOptions);
            if (
              !hasEmptyBody(program) &&
              !hasExpressionBody(program) &&
              !hasLabeledStatementBody(program)
            ) {
              context.report({
                loc,
                messageId: "forbidden",
              });
            }
            continue;
          } catch (error) {}

          // Comments within certain nodes - e.g. class declarations - need to
          // be wrapped in a similar context to determine whether or not they
          // are commented-out code.
          const index = sourceCode.getIndexFromLoc(loc.start);
          const node = sourceCode.getNodeByRangeIndex(index);
          const wrappedContent = wrapContent(content, node);
          if (wrappedContent) {
            try {
              parse(wrappedContent, parserOptions);
              context.report({
                loc,
                messageId: "forbidden",
              });
            } catch (error) {}
          }
        }
      },
    };
  },
});

function hasEmptyBody(program: es.Program) {
  return program.type === "Program" && program.body.length === 0;
}

function hasExpressionBody(program: es.Program) {
  return (
    program.type === "Program" &&
    program.body.length === 1 &&
    program.body[0].type === "ExpressionStatement" &&
    isExpressionOrIdentifierOrLiteral(program.body[0].expression)
  );
}

function hasLabeledStatementBody(program: es.Program) {
  return (
    program.type === "Program" &&
    program.body.length === 1 &&
    program.body[0].type === "LabeledStatement"
  );
}

function isExpressionOrIdentifierOrLiteral(node: es.Node): boolean {
  if (node.type === "Identifier") {
    return true;
  }
  if (node.type === "Literal") {
    return true;
  }
  if (node.type === "BinaryExpression") {
    return (
      isExpressionOrIdentifierOrLiteral(node.left) &&
      isExpressionOrIdentifierOrLiteral(node.right)
    );
  }
  return false;
}

function isRegionComment(content: string) {
  return /\s*#(end)?region/.test(content);
}

function toBlocks(comments: es.Comment[]) {
  const blocks: {
    content: string;
    loc: es.SourceLocation;
  }[] = [];
  let prevLine: es.LineComment | undefined;
  for (const comment of comments) {
    if (comment.type === "Block") {
      blocks.push({
        content: comment.value.replace(/^\s*\*/, "").replace(/\n\s*\*/g, "\n"),
        loc: { ...comment.loc },
      });
      prevLine = undefined;
    } else if (comment.type === "Line") {
      if (prevLine && prevLine.loc.start.line === comment.loc.start.line - 1) {
        const prevBlock = blocks[blocks.length - 1];
        prevBlock.content += `\n${comment.value}`;
        prevBlock.loc.end = comment.loc.end;
      } else {
        blocks.push({
          content: comment.value,
          loc: { ...comment.loc },
        });
      }
      prevLine = comment;
    }
  }
  return blocks;
}

function wrapContent(
  content: string,
  node: es.Node | null
): string | undefined {
  switch (node?.type) {
    case "ArrayExpression":
      return `let wrapper = [${content}]`;
    case "ClassBody":
      return `class Wrapper { ${content} }`;
    case "ImportDeclaration":
      return `import { ${content} } from "wrapper"`;
    case "ObjectExpression":
      return `let wrapper = { ${content} }`;
    case "FunctionDeclaration":
      return `function wrapper(${content}) {}`;
    case "SwitchStatement":
      return `switch (wrapper) { ${content} }`;
    case "TSInterfaceBody":
      return `interface Wrapper { ${content} }`;
    case "TSTypeLiteral":
      return `type Wrapper = { ${content} }`;
    default:
      return undefined;
  }
}

export = rule;
