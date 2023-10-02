import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { indentWithTab } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { languages } from '@codemirror/language-data';
import { Compartment, EditorState, EditorStateConfig } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { markdoc } from '@newbee/codemirror-lang-markdoc';
import { CodemirrorComponent } from '@newbee/ngx-codemirror';
import { githubDark, githubLight } from '@uiw/codemirror-theme-github';
import { EditorView, basicSetup } from 'codemirror';

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
   * The config we will feed into the editor state.
   */
  editorStateConfig!: EditorStateConfig;

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
            codeLanguages: languages,
          }),
        ),

        // add key-binding support for tabs
        keymap.of([indentWithTab]),

        // makes 1 tab equal 2 spaces
        tabSize.of(EditorState.tabSize.of(2)),

        // allow lines to wrap to avoid horizontal scrolling
        EditorView.lineWrapping,

        // adds theming
        ...(window.matchMedia
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
            ? [githubDark]
            : [githubLight]
          : [githubDark]),
      ],
    };
  }
}
