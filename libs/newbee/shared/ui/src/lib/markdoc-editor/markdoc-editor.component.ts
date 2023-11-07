import { CommonModule, isPlatformServer } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { indentWithTab } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { LanguageDescription } from '@codemirror/language';
import { languages } from '@codemirror/language-data';
import { linter } from '@codemirror/lint';
import { search } from '@codemirror/search';
import { Compartment, EditorState, EditorStateConfig } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import Markdoc from '@markdoc/markdoc';
import { lint, markdoc } from '@newbee/codemirror-lang-markdoc';
import { CodemirrorComponent } from '@newbee/ngx-codemirror';
import { strToContent } from '@newbee/shared/util';
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
   * Emits the editor's new text value whenever it's changed.
   */
  @Output() textChange = new EventEmitter<string>();

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

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

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
                this.textChange.emit(docString);
                const content = strToContent(docString);
                this.renderedEditorContent = Markdoc.renderers.html(content);
              }),
            ]
          : []),

        // adds general theming
        ...(this.useDarkTheme ? [githubDark] : [githubLight]),
      ],
    };
  }

  /**
   * A helper function to determine whether we should use a dark theme for the code editor.
   */
  get useDarkTheme(): boolean {
    if (
      isPlatformServer(this.platformId) ||
      !window.matchMedia ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return true;
    }

    return false;
  }
}
