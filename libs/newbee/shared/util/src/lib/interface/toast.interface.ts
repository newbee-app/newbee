import { AlertType, ToastXPosition, ToastYPosition } from '../enum';

/**
 * All of the information needed to create a toast.
 */
export interface Toast {
  /**
   * The UUID of the toast.
   */
  id: string;

  /**
   * The header for the alert in the toast.
   */
  header: string;

  /**
   * The text for the alert in the toast.
   */
  text: string;

  /**
   * The type for the alert in the toast.
   */
  type: AlertType;

  /**
   * The position for the alert in the toast.
   */
  position: [ToastXPosition, ToastYPosition];

  /**
   * How long the toast should be visible on the screen.
   */
  duration: number | null;
}
