import Markdoc from '@markdoc/markdoc';
import markdocTxtRenderer from '@newbee/markdoc-txt-renderer';
import { strToContent } from '@newbee/shared/util';

/**
 * Takes in a Markdoc document as a string and returns the document rendered as plain text and html.
 *
 * @param markdoc The Markdoc document to render.
 *
 * @returns
 */
export function renderMarkdoc(markdoc: string | null | undefined): {
  txt: string | null | undefined;
  html: string | null | undefined;
} {
  if (!markdoc) {
    return { txt: markdoc, html: markdoc };
  }

  const content = strToContent(markdoc);
  return {
    txt: markdocTxtRenderer(content),
    html: Markdoc.renderers.html(content),
  };
}
