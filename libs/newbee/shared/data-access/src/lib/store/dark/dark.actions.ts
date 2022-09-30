import { createActionGroup, emptyProps } from '@ngrx/store';

export const DarkActions = createActionGroup({
  source: 'Dark',
  events: {
    Activate: emptyProps(),
    Disable: emptyProps(),
    System: emptyProps(),
  },
});
