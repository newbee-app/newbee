import { MagicLinkLoginLoginForm } from '@newbee/newbee/auth/util';
import { LoginDto, MagicLinkLoginDto } from '@newbee/shared/data-access';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Send Magic Link': props<MagicLinkLoginLoginForm>(),
    'Send Magic Link Success': props<MagicLinkLoginDto>(),
    'Send Magic Link Error': emptyProps(),
    'Login Success': props<LoginDto>(),
    'Login Error': emptyProps(),
  },
});
