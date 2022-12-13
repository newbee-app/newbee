import { createActionGroup, emptyProps } from '@ngrx/store';

/**
 * All actions tied to `DarkState`.
 */
export const DarkActions = createActionGroup({
  source: 'Dark',
  events: {
    /**
     * Activates dark mode.
     */
    Activate: emptyProps(),

    /**
     * Disable dark mode.
     */
    Disable: emptyProps(),

    /**
     * Set the dark mode to match system settings.
     */
    System: emptyProps(),
  },
});
