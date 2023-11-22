import { CommonModule, isPlatformServer } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { EditorState, EditorStateConfig } from '@codemirror/state';
import { EditorView } from 'codemirror';

/**
 * A simple codemirror component compatible with Angular.
 * Sets up a state and view for the editor, taking care to properly destroy the view when the component is destroyed.
 * The user is responsible for specifying a config for the editor's state.
 */
@Component({
  selector: 'newbee-codemirror',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './codemirror.component.html',
})
export class CodemirrorComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * The config to use for the editor's state.
   * If null, it will not specify a config for the editor to use.
   */
  @Input() editorStateConfig: EditorStateConfig | null = null;

  /**
   * The state to use for the editor.
   */
  state!: EditorState;

  /**
   * The view to use for the editor, which can be null if it's not initialized on the server-side.
   */
  view: EditorView | null = null;

  /**
   * The div element to serve as the wrapper for the editor's view.
   */
  @ViewChild('wrapper') wrapper!: ElementRef<HTMLDivElement>;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  /**
   * Sets up the editor state after the component receives inputs.
   */
  ngOnInit(): void {
    this.state = this.editorStateConfig
      ? EditorState.create(this.editorStateConfig)
      : EditorState.create();
  }

  /**
   * Set up the editor view after the component view has been initialized, if not on the server-side.
   */
  ngAfterViewInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.view = new EditorView({
      state: this.state,
      parent: this.wrapper.nativeElement,
    });
  }

  /**
   * Destroy the editor view when this component is destroyed.
   */
  ngOnDestroy(): void {
    this.view?.destroy();
  }
}
