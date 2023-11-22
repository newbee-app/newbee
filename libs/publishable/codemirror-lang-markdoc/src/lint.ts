import { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import Markdoc, { ConfigType, Node } from '@markdoc/markdoc';
import yaml from 'js-yaml';

/**
 * A function that can be fed into the `linter()` method in `@codemirror/lint` to set up linting for Markdoc.
 *
 * @param view The view to lint.
 *
 * @returns An array of issues formatted in an array that codemirror can understand (`Diagnostic`).
 */
export function lint(view: EditorView): Diagnostic[] {
  const { state } = view;
  const ast = Markdoc.parse(state.doc.toString());
  const config = generateConfig(ast);
  const errors = Markdoc.validate(ast, config);
  if (!errors.length) {
    return [];
  }

  const { doc } = state;
  return errors
    .map((err): Diagnostic | null => {
      const { type, lines, location, error } = err;

      // ignore if the location isn't specified
      if (!location && !lines.length) {
        return null;
      }
      // ignore if it's a debug-level error
      else if (error.level === 'debug') {
        return null;
      }

      // get the lines where the error starts and ends
      const lineStart = doc.line(
        ((location?.start.line ?? lines[0]) as number) + 1,
      );
      const lineEnd = doc.line(
        ((location?.end.line ?? lines[lines.length - 1]) as number) + 1,
      );

      // get the codemirror positions where the rror starts and ends
      const posStart = location?.start.character
        ? lineStart.from + location.start.character
        : lineStart.from;
      const posEnd = location?.end.character
        ? lineEnd.to + location.end.character
        : lineEnd.to;

      // convert the markdoc error level to a codemirror severity
      const { level } = error;
      const severity =
        level === 'critical' || level === 'error'
          ? 'error'
          : level === 'info'
          ? 'info'
          : 'warning';

      return {
        from: posStart,
        to: posEnd,
        severity,
        message: error.message,
        source: `${type}: ${error.id}`,
      };
    })
    .filter((val): val is Diagnostic => val !== null);
}

/**
 * A function to generate a Markdoc config based on an AST.
 *
 * @param ast The AST to use to form the config.
 *
 * @returns The config based off of the AST.
 */
export function generateConfig(ast: Node): ConfigType {
  // load frontmatter using yaml, making it compatible with yaml and json
  let frontmatter: unknown = {};
  if (ast.attributes['frontmatter']) {
    try {
      frontmatter = yaml.load(ast.attributes['frontmatter']);
    } catch (err) {
      // pass
    }
  }

  return { variables: { frontmatter, fm: frontmatter } };
}
