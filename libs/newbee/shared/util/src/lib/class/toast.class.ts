import { v4 } from 'uuid';
import { AlertType, ToastXPosition, ToastYPosition } from '../enum';

/**
 * All of the information needed to create a toast.
 */
export class Toast {
  /**
   * The UUID of the toast.
   */
  id = v4();

  /**
   * @param header The header for the alert in the toast.
   * @param text The text for the alert in the toast.
   * @param type The type for the alert in the toast.
   * @param position The position for the alert in the toast.
   * @param duration How long the toast should be visible on the screen in ms.
   */
  constructor(
    public readonly header: string,
    public readonly text: string,
    public readonly type: AlertType,
    public readonly position: [ToastXPosition, ToastYPosition],
    public readonly duration: number | null,
  ) {}
}
