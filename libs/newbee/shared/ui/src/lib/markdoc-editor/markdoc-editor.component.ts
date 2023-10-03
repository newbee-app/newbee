import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { indentWithTab } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { LanguageDescription } from '@codemirror/language';
import { languages } from '@codemirror/language-data';
import { Compartment, EditorState, EditorStateConfig } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import Markdoc, { ConfigType } from '@markdoc/markdoc';
import { markdoc } from '@newbee/codemirror-lang-markdoc';
import { CodemirrorComponent } from '@newbee/ngx-codemirror';
import { githubDark, githubLight } from '@uiw/codemirror-theme-github';
import { basicSetup } from 'codemirror';
import yaml from 'js-yaml';

/**
 * A Markdoc editor component built with CodeMirror.
 */
@Component({
  selector: 'newbee-markdoc-editor',
  standalone: true,
  imports: [CommonModule, CodemirrorComponent],
  templateUrl: './markdoc-editor.component.html',
})
export class MarkdocEditorComponent implements OnInit {
  /**
   * The starting value for the editor's text.
   */
  @Input() text = '';

  /**
   * Whether to generate a preview for the Markdoc next to the editor.
   */
  @Input() preview = true;

  /**
   * The config we will feed into the editor state.
   */
  editorStateConfig!: EditorStateConfig;

  /**
   * The content of the editor, as rendered markdoc.
   */
  renderedEditorContent = '';

  /**
   * Sets up the editor state config using the component's inputs.
   */
  ngOnInit(): void {
    const language = new Compartment();
    const tabSize = new Compartment();

    this.editorStateConfig = {
      doc: this.text,
      extensions: [
        // basic foundations
        basicSetup,

        // adds language support for markdoc specifically
        language.of(
          markdoc({
            defaultCodeLanguage: javascript(),
            codeLanguages: [
              ...languages,
              LanguageDescription.of({
                name: 'Markdoc',
                alias: ['markdoc'],
                extensions: ['md'],
                load: async () => {
                  return markdoc();
                },
              }),
            ],
          }),
        ),

        // add key-binding support for tabs
        keymap.of([indentWithTab]),

        // makes 1 tab equal 2 spaces
        tabSize.of(EditorState.tabSize.of(2)),

        // allow lines to wrap to avoid horizontal scrolling
        EditorView.lineWrapping,

        // set up rendering if preview is enabled
        ...(this.preview
          ? [
              EditorView.updateListener.of((update) => {
                // If the document didn't change, do nothing
                if (!update.docChanged) {
                  return;
                }

                const ast = Markdoc.parse(update.state.doc.toString());

                // Load frontmatter using yaml, making it compatible with yaml and json
                let frontmatter: unknown = {};
                if (ast.attributes['frontmatter']) {
                  try {
                    frontmatter = yaml.load(ast.attributes['frontmatter']);
                  } catch (err) {
                    // pass
                  }
                }

                // Set up the config to feed into `transform`
                const config: ConfigType = { variables: { frontmatter } };

                const content = Markdoc.transform(ast, config);
                this.renderedEditorContent = Markdoc.renderers.html(content);
              }),
            ]
          : []),

        // adds general theming
        ...(window.matchMedia
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
            ? [githubDark]
            : [githubLight]
          : [githubDark]),
      ],
    };
  }
}
