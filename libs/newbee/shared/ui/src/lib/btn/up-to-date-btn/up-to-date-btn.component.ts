import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { type PostQueryResult } from '@newbee/shared/util';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { TooltipComponent } from '../../tooltip';

dayjs.extend(relativeTime);

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
    return new Date() < new Date(this.post.outOfDateAt);
  }

  /**
   * Converts the post's `markedUpToDateAt` Date into a time ago string.
   * @returns The time ago string for when the post was last marked up-to-date.
   */
  get lastMarkedUpToDate(): string {
    return `Last marked up-to-date ${dayjs(
      this.post.markedUpToDateAt,
    ).fromNow()}`;
  }
}
