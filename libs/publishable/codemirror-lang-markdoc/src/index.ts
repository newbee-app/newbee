import { markdown } from '@codemirror/lang-markdown';
import {
  Language,
  LanguageDescription,
  LanguageSupport,
  foldNodeProp,
  indentNodeProp,
} from '@codemirror/language';
import { parseMixed } from '@lezer/common';
import { styleTags, tags as t } from '@lezer/highlight';
import { MarkdownExtension, Table } from '@lezer/markdown';
import { parser } from './markdoc.grammar';

/**
 * LRParser generated from the Markdoc grammar with style tags added.
 */
const baseParser = parser.configure({
  props: [indentNodeProp.add({}), foldNodeProp.add({})],
});

/**
 * The Markdoc language, with default settings.
 */
export const markdocLanguage = markdown().language;

/**
 * A function that returns language support for Markdoc, with default settings.
 *
 * @returns The language support for Markdoc, with default settings.
 */
export function markdoc(config?: {
  defaultCodeLanguage?: Language | LanguageSupport;
  codeLanguages?:
    | readonly LanguageDescription[]
    | ((info: string) => Language | LanguageDescription | null);
  addKeymap?: boolean;
  extensions?: MarkdownExtension;
  base?: Language;
  completeHTMLTags?: boolean;
}): LanguageSupport {
  /**
   * Extensions that create an adjusted version of CommonMark compatible with Markdoc.
   * GitHub-Flavored Markdown style tables are added.
   * Indented code blocks and setext headings are removed.
   * Support for Markdoc tags and a Markdoc parse wrapper are added.
   */
  const defaultExtensions: MarkdownExtension = [
    Table,
    { remove: ['IndentedCode', 'SetextHeading'] },
    {
      props: [
        // Adjust some existing styles so highlighter isn't overwritten for Markdoc
        styleTags({
          Blockquote: t.quote,
          ATXHeading1: t.heading1,
          ATXHeading2: t.heading2,
          ATXHeading3: t.heading3,
          ATXHeading4: t.heading4,
          ATXHeading5: t.heading5,
          ATXHeading6: t.heading6,
          Emphasis: t.emphasis,
          StrongEmphasis: t.strong,
          'Link Image': t.link,
        }),
      ],
      defineNodes: [
        { name: 'Tag', block: true },
        { name: 'InlineTag', block: false },
      ],
      parseBlock: [
        {
          name: 'Tag',
          parse: (cx, line) => {
            // Look for the tag start notation and move on if it's not found
            if (
              line.next !== 123 /* { */ ||
              line.text.charCodeAt(line.pos + 1) !== 37 /* % */
            ) {
              return false;
            }

            // Save the from value before moving the line
            const from = cx.lineStart + line.pos;

            // Look for the tag end notation, advancing through lines until it's found
            let lineTagEnd = line.text.slice(line.pos + 2).indexOf('%}');
            if (lineTagEnd !== -1) {
              lineTagEnd += line.pos + 2;
            }
            while (lineTagEnd === -1 && cx.nextLine()) {
              lineTagEnd = line.text.indexOf('%}');
            }

            // If it's not found, move on
            if (lineTagEnd === -1) {
              return false;
            }

            // If it's found, create a new tag node and move the line
            cx.addElement(cx.elt('Tag', from, cx.lineStart + lineTagEnd + 2));
            cx.nextLine();
            return true;
          },
        },
      ],
      parseInline: [
        {
          name: 'InlineTag',
          parse: (cx, next, pos) => {
            // Look for the tag start notation and move on if it's not found
            if (next !== 123 /* { */ || cx.char(pos + 1) !== 37 /* % */) {
              return -1;
            }

            // Look for the tag end notation, exit if it's found before our given pos or not found at all
            const lineTagEnd = cx.slice(pos + 2, cx.end).indexOf('%}');
            if (lineTagEnd === -1) {
              return -1;
            }

            // If it's found, create a new tag node and return the position where the node ends
            return cx.addElement(
              cx.elt('InlineTag', pos, pos + 2 + lineTagEnd + 2),
            );
          },
        },
      ],
    },
    {
      wrap: parseMixed((node) =>
        node.type.name === 'Tag' || node.type.name === 'InlineTag'
          ? { parser: baseParser }
          : null,
      ),
    },
  ];

  // Add the default Markdoc extensions, which can be overwritten by user extensions
  if (!config) {
    config = { extensions: defaultExtensions };
  } else if (!config.extensions) {
    config.extensions = defaultExtensions;
  } else if (Array.isArray(config.extensions)) {
    config.extensions = defaultExtensions.concat(config.extensions);
  } else {
    config.extensions = [...defaultExtensions, config.extensions];
  }

  return markdown(config);
}
