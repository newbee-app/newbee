/**
 * Actively ignore the fed-in mouse event.
 *
 * @param event The mouse event to ignore.
 */
export function ignoreMouseEvent(event: MouseEvent): void {
  event.preventDefault();
}

/**
 * Call blur on the document's active element.
 */
export function blurActiveElement(): void {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}
