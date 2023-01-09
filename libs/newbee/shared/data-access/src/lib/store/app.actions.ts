import { createActionGroup, emptyProps } from '@ngrx/store';

/**
 * Global app-level actions that do not belong to a specific module.
 */
export const AppActions = createActionGroup({
  source: 'App',
  events: {
    /**
     * Reset all parts of the state that indicates something is pending.
     */
    'Reset Pending Actions': emptyProps(),
  },
});
