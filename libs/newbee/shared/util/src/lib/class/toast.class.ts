import { v4 } from 'uuid';
import { AlertType, ToastXPosition, ToastYPosition } from '../enum';
import { Button } from './button.class';

/**
 * All of the information needed to create a toast.
 */
export class Toast {
  /**
   * The UUID of the toast.
   */
  readonly id = v4();

  /**
   * @param header The header for the alert in the toast.
   * @param text The text for the alert in the toast.
   * @param type The type for the alert in the toast.
   * @param position The position for the alert in the toast.
   * @param duration How long the toast should be visible on the screen in ms.
   */
  constructor(
    readonly header: string,
    readonly text: string,
    readonly type: AlertType,
    readonly position: [ToastXPosition, ToastYPosition],
    readonly duration: number | null,
    readonly button: Button | null,
  ) {}
}
