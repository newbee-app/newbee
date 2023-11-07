import Markdoc from '@markdoc/markdoc';
import markdocTxtRenderer from './markdoc-txt-renderer';

describe('markdocTxtRenderer', () => {
  it('should render markdoc to plain text', () => {
    const markdoc = `# {% $title %} {% #overview %}

Markdoc is a Markdown-based syntax and toolchain for creating custom documentation sites. Stripe created Markdoc to power [our public docs](http://stripe.com/docs).

{% if $title %}
Markdoc is open-source—check out its [source](http://github.com/markdoc/markdoc) to see how it works.\n
{% / if %}

## How is Markdoc different?

Markdoc uses a fully declarative approach to composition and flow control, where other solutions… [Read more](/docs/overview).

## Next steps

- [Install Markdoc](/docs/getting-started)
- [Explore the syntax](/docs/syntax) `;

    const ast = Markdoc.parse(markdoc);
    const content = Markdoc.transform(ast, {
      variables: { title: 'What is Markdoc?' },
    });
    const plainTxt = markdocTxtRenderer(content);
    // const plainTxt = Markdoc.renderers.html(content);

    expect(plainTxt).toEqual(
      `What is Markdoc? Markdoc is a Markdown-based syntax and toolchain for creating custom documentation sites. Stripe created Markdoc to power our public docs. Markdoc is open-source—check out its source to see how it works. How is Markdoc different? Markdoc uses a fully declarative approach to composition and flow control, where other solutions… Read more. Next steps Install Markdoc Explore the syntax`,
    );
  });
});
