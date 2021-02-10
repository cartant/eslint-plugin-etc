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
    return {
      Program: () => {
        const comments = context.getSourceCode().getAllComments();
        const blocks = toBlocks(comments);
        for (const block of blocks) {
          try {
            const { content, loc } = block;
            if (!isUnintentionallyParsable(content)) {
              parse(content, parserOptions);
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
  return /^\s*[a-z]+(:\s*[a-z]+)?\s*$/i.test(content);
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

export = rule;
