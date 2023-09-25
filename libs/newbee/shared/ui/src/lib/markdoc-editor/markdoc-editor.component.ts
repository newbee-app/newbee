import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Compartment, EditorState, EditorStateConfig } from '@codemirror/state';
import { markdoc } from '@newbee/codemirror-lang-markdoc';
import { CodemirrorComponent } from '@newbee/ngx-codemirror';
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
        basicSetup,
        language.of(markdoc()),
        tabSize.of(EditorState.tabSize.of(2)),
      ],
    };
  }
}
