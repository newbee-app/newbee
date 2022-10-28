import { NgModule } from '@angular/core';
import {
  AuthEffects,
  authFeature,
  AuthService,
} from '@newbee/newbee/auth/data-access';
import {
  MagicLinkLoginLoginFormComponentModule,
  MagicLinkLoginRegisterFormComponentModule,
} from '@newbee/newbee/auth/ui';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthRoutingModule } from './routing';

@NgModule({
  imports: [
    AuthRoutingModule,
    StoreModule.forFeature(authFeature),
    EffectsModule.forFeature([AuthEffects]),
    MagicLinkLoginLoginFormComponentModule,
    MagicLinkLoginRegisterFormComponentModule,
  ],
  providers: [AuthService],
  declarations: [LoginComponent, RegisterComponent],
})
export class AuthModule {}
