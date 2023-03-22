import { RenderableTreeNodes, Tag } from '@markdoc/markdoc';

/**
 * A simple renderer for turning Markdoc into plain text.
 *
 * @param node The RenderableTreeNodes to turn to plain text.
 *
 * @returns The rendered output as a string.
 */
export default function render(node: RenderableTreeNodes): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return normalizeWhitespace(String(node));
  }

  // Add a space between 2 tags, but otherwise don't
  if (Array.isArray(node)) {
    let lastWasTag = false;
    return normalizeWhitespace(
      node
        .map((val) => {
          const currIsTag = typeof val === 'object' && Tag.isTag(val);
          const strVal =
            lastWasTag && currIsTag ? ` ${render(val)}` : render(val);
          lastWasTag = currIsTag;
          return strVal;
        })
        .join('')
    );
  }

  // If it's null, a boolean, or an object that isn't a tag
  if (node === null || typeof node !== 'object' || !Tag.isTag(node)) {
    return '';
  }

  const { children = [] } = node;
  return render(children);
}

/**
 * Normalize the whitespace for the given string by replacing any whitespaces with a single space.
 *
 * @param str The string to normalize.
 *
 * @returns The string with normalized whitespaces.
 */
function normalizeWhitespace(str: string): string {
  return str.replace(/\s+/g, ' ');
}
