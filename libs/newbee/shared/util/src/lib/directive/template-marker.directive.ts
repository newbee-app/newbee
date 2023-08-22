import { CommonModule } from '@angular/common';
import { Directive, NgModule, TemplateRef } from '@angular/core';

/**
 * A helper directive to be used with <ng-template> for the sake of conditional content projection.
 */
@Directive({
  selector: '[newbeeTemplateMarker]',
})
export class TemplateMarkerDirective {
  constructor(public readonly templateRef: TemplateRef<unknown>) {}
}

@NgModule({
  imports: [CommonModule],
  declarations: [TemplateMarkerDirective],
  exports: [TemplateMarkerDirective],
})
export class TemplateMarkerDirectiveModule {}
