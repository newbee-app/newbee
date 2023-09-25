import { commonmarkLanguage, markdown } from '@codemirror/lang-markdown';
import { LRLanguage, LanguageSupport } from '@codemirror/language';
import { parseMixed } from '@lezer/common';
import { styleTags, tags as t } from '@lezer/highlight';
import { MarkdownParser, Table } from '@lezer/markdown';
import { parser } from './markdoc.grammar';
import { Text } from './markdoc.grammar.terms';

/**
 * An adjusted version of CommonMark compatible with Markdoc.
 * GitHub-Flavored Markdown style tables are added.
 * Indented code blocks and setext headings are removed.
 */
const commonMarkParser = (
  commonmarkLanguage.parser as MarkdownParser
).configure([Table, { remove: ['IndentedCode', 'SetextHeading'] }]);

/**
 * LRParser generated from the Markdoc grammar with style tags added.
 */
const baseParser = parser.configure({
  props: [
    styleTags({
      'TagStart TagEnd': t.brace,
      '[ ]': t.squareBracket,
      '( )': t.paren,
      ',': t.separator,
      '.': t.derefOperator,

      TagInterior: t.tagName,

      Attribute: t.attributeName,
      AttributeShorthand: t.attributeValue,

      Function: t.function(t.name),
      FunctionParameterNamed: t.function(t.propertyName),

      ValueNull: t.null,
      ValueBoolean: t.bool,
      ValueNumber: t.number,
      ValueString: t.string,

      StringEscapeSequence: t.escape,

      HashKey: t.propertyName,

      Variable: t.variableName,
      VariableTail: t.special(t.variableName),

      Text: t.content,
    }),
  ],
});

/**
 * The Markdoc language, with default settings.
 */
export const markdocLanguage = LRLanguage.define({
  parser: baseParser.configure({
    wrap: parseMixed((node) =>
      node.type.id === Text ? { parser: commonMarkParser } : null,
    ),
  }),
});

/**
 * A function that returns language support for Markdoc, with default settings.
 *
 * @returns The language support for Markdoc, with default settings.
 */
export function markdoc(): LanguageSupport {
  return new LanguageSupport(markdocLanguage, [markdown().support]);
}
