import { NgModule } from '@angular/core';
import {
  AuthenticatorEffects,
  AuthenticatorService,
} from '@newbee/newbee/authenticator/data-access';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [EffectsModule.forFeature([AuthenticatorEffects])],
  providers: [AuthenticatorService],
})
export class AuthenticatorModule {}
