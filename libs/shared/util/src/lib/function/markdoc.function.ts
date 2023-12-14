import Markdoc, { RenderableTreeNode } from '@markdoc/markdoc';
import { generateConfig } from '@newbee/codemirror-lang-markdoc';

/**
 * Converts a string into a Markdoc `RenderableTreeNode`, coloquially known as `contnet`.
 *
 * @param markdoc The raw Markdoc string to convert.
 *
 * @returns The raw Markdoc string parsed and transformed, but not rendered.
 */
export function strToContent(markdoc: string): RenderableTreeNode {
  if (!markdoc) {
    return null;
  }

  const ast = Markdoc.parse(markdoc);
  const config = generateConfig(ast);
  return Markdoc.transform(ast, config);
}
