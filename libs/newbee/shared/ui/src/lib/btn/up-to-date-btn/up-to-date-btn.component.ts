import { CommonModule } from '@angular/common';
import { Component, Inject, Input, LOCALE_ID } from '@angular/core';
import { createTimeAgo, type Post } from '@newbee/shared/util';
import TimeAgo from 'javascript-time-ago';
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
   * A helper that converts a Date object into a time ago string.
   */
  private readonly timeAgo: TimeAgo;

  /**
   * The post in question.
   */
  @Input() post!: Post;

  constructor(@Inject(LOCALE_ID) localeId: string) {
    this.timeAgo = createTimeAgo(localeId);
  }

  /**
   * Converts the post's `markedUpToDateAt` Date into a time ago string.
   * @returns The time ago string for when the post was last marked up-to-date.
   */
  lastMarkedUpToDate(): string {
    return `Last marked up-to-date ${this.timeAgo.format(
      this.post.markedUpToDateAt,
      'twitter-minute-now'
    )}`;
  }
}
