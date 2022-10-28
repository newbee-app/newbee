import { MagicLinkLoginLoginForm } from '@newbee/newbee/auth/util';
import {
  BaseLoginDto,
  BaseMagicLinkLoginDto,
} from '@newbee/shared/data-access';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Send Login Magic Link': props<MagicLinkLoginLoginForm>(),
    'Send Login Magic Link Success': props<BaseMagicLinkLoginDto>(),
    'Send Login Magic Link Error': emptyProps(),
    'Send Register Magic Link': props<MagicLinkLoginLoginForm>(),
    'Send Register Magic Link Success': props<BaseMagicLinkLoginDto>(),
    'Send Register Magic Link Error': emptyProps(),
    'Login Success': props<BaseLoginDto>(),
    'Login Error': emptyProps(),
  },
});
