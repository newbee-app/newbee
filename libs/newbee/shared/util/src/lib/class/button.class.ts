/**
 * A class for a UI to feed in the information for creating a button to another UI.
 */
export class Button {
  /**
   * @param text The text to display within the button.
   * @param click What to do when the button is clicked.
   * @param styles The styles to use for the buttons.
   * @param _disabled When to show the button as disabled.
   * @param _pending When to show the button as pending.
   */
  constructor(
    readonly text: string,
    readonly click: () => void | Promise<void>,
    readonly styles: string | string[] | Record<string, boolean> | null,
    private readonly _disabled: boolean | (() => boolean),
    private readonly _pending: boolean | (() => boolean),
  ) {}

  /**
   * Whether to show the button as disabled.
   */
  get disabled(): boolean {
    return typeof this._disabled === 'boolean'
      ? this._disabled
      : this._disabled();
  }

  /**
   * Whether to show the button as pending.
   */
  get pending(): boolean {
    return typeof this._pending === 'boolean' ? this._pending : this._pending();
  }
}
