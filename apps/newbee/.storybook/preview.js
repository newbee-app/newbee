import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import scss from 'react-syntax-highlighter/dist/esm/langugaes/prism/scss';

SyntaxHighlighter.registerLanguage('scss', scss);

export const parameters = {
  options: {
    storySort: {
      method: 'alphabetical',
    },
  },
};
