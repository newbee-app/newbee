import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { indentWithTab } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { LanguageDescription } from '@codemirror/language';
import { languages } from '@codemirror/language-data';
import { linter } from '@codemirror/lint';
import { search } from '@codemirror/search';
import { Compartment, EditorState, EditorStateConfig } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import Markdoc from '@markdoc/markdoc';
import { generateConfig, lint, markdoc } from '@newbee/codemirror-lang-markdoc';
import { CodemirrorComponent } from '@newbee/ngx-codemirror';
import { githubDark, githubLight } from '@uiw/codemirror-theme-github';
import { basicSetup } from 'codemirror';

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
   * Emits the editor's content whenever it's changed.
   */
  @Output() content = new EventEmitter<string>();

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

        // set up in basicSetup, but change to appear on the top
        search({ top: true }),

        // add key-binding support for tabs
        keymap.of([indentWithTab]),

        // makes 1 tab equal 2 spaces
        tabSize.of(EditorState.tabSize.of(2)),

        // allow lines to wrap to avoid horizontal scrolling
        EditorView.lineWrapping,

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

        // sets up markdoc linting
        linter(lint),

        // set up rendering if preview is enabled
        ...(this.preview
          ? [
              EditorView.updateListener.of((update) => {
                // If the document didn't change, do nothing
                if (!update.docChanged) {
                  return;
                }

                const docString = update.state.doc.toString();
                this.content.emit(docString);

                const ast = Markdoc.parse(docString);
                const config = generateConfig(ast);
                const content = Markdoc.transform(ast, config);
                this.renderedEditorContent = Markdoc.renderers.html(content);
              }),
            ]
          : []),

        // adds general theming
        ...(window && window.matchMedia
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
            ? [githubDark]
            : [githubLight]
          : [githubDark]),
      ],
    };
  }
}
