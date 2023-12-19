import { CommonModule } from '@angular/common';
import {
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
} from '@angular/core';
import { type Placement } from '@floating-ui/dom';
import { DropdownComponent } from '../dropdown/dropdown.component';

/**
 * A specialized type of the `DropdownComponent` that, instead of taking in a generic label element from the template, takes in a text for a label and creates the label with an arrow that toggles based on the `expanded` state.
 *
 * This component exists solely for aesthetic beauty.
 */
@Component({
  selector: 'newbee-dropdown-with-arrow',
  standalone: true,
  imports: [CommonModule, DropdownComponent],
  templateUrl: './dropdown-with-arrow.component.html',
})
export class DropdownWithArrowComponent {
  /**
   * The text for the dropdown label.
   */
  @Input() labelText = '';

  /**
   * The `ngClass` to add for the label.
   */
  @Input() labelClasses: { [classes: string]: boolean } | string[] | string =
    {};

  /**
   * Whether to disable the label button.
   */
  @Input() disabled = false;

  /**
   * Which direction the dropdown should go.
   */
  @Input() placement: Placement = 'bottom';

  /**
   * How many px the dropdown should be offset.
   * Defaults to 10.
   */
  @Input() offset = 10;

  /**
   * How the dropdown should behave when the label is clicked.
   * Default is `toggle`, which will toggle it on and off.
   * `expand` will just expand, not shrink.
   */
  @Input() expandStrategy: 'toggle' | 'expand' = 'toggle';

  /**
   * Whether the dropdown should be portalled to the app component.
   */
  @Input() portal = true;

  /**
   * Whether the dropdown is showing or not.
   */
  @Input() expanded = false;

  /**
   * Emits whenever the dropdown is expanded or shrunk.
   */
  @Output() expandedChange = new EventEmitter<boolean>();

  /**
   * Any portion of the dropdown that sholdn't toggle expanded when clicked.
   * Should be specified in the parent component.
   * Should be specified as a template variable in a plain HTML element like a div, button, etc.
   */
  @ContentChildren('dropdownNoToggle', { descendants: true })
  dropdownNoToggleElements: QueryList<ElementRef<HTMLElement>> | undefined;
}
