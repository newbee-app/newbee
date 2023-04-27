/**
 * Actively ignore the fed-in mouse event.
 *
 * @param event The mouse event to ignore.
 */
export function ignoreMouseEvent(event: MouseEvent): void {
  event.preventDefault();
}
