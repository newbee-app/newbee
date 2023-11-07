import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { nbDayjs, type PostQueryResult } from '@newbee/shared/util';
import { TooltipComponent } from '../../tooltip';

/**
 * A dumb UI that displays a green check mark if a post is up-to-date and a red x if it's not.
 */
@Component({
  selector: 'newbee-up-to-date-btn',
  standalone: true,
  imports: [CommonModule, TooltipComponent],
  templateUrl: './up-to-date-btn.component.html',
})
export class UpToDateBtnComponent {
  /**
   * The post in question.
   */
  @Input() post!: PostQueryResult;

  /**
   * Whether the input post is up-to-date.
   */
  get upToDate(): boolean {
    return new Date() < this.post.outOfDateAt;
  }

  /**
   * Converts the post's `markedUpToDateAt` Date into a time ago string.
   * @returns The time ago string for when the post was last marked up-to-date.
   */
  get lastMarkedUpToDate(): string {
    return `Last marked up-to-date ${nbDayjs(
      this.post.markedUpToDateAt,
    ).fromNow()}`;
  }
}
