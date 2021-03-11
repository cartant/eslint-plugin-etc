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
          try {
            const { content, loc } = block;
            if (!isUnintentionallyParsable(content)) {
              const index = sourceCode.getIndexFromLoc(loc.start);
              const node = sourceCode.getNodeByRangeIndex(index);
              parse(wrapContent(content, node), parserOptions);
              context.report({
                loc,
                messageId: "forbidden",
              });
            }
          } catch (error) {}
        }
      },
    };
  },
});

function isUnintentionallyParsable(content: string) {
  // https://stackoverflow.com/a/2008444/6680611
  return (
    /^\s*$/.test(content) ||
    /^\s*[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(:\s*[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?\s*$/i.test(
      content
    )
  );
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

function wrapContent(content: string, node: es.Node | null): string {
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
      return content;
  }
}

export = rule;
