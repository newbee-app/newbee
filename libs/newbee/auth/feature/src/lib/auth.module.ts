import { NgModule } from '@angular/core';
import { AuthEffects } from '@newbee/newbee/auth/data-access';
import {
  MagicLinkLoginLoginFormComponentModule,
  MagicLinkLoginRegisterFormComponentModule,
} from '@newbee/newbee/auth/ui';
import { authFeature } from '@newbee/newbee/shared/data-access';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthRoutingModule } from './routing';

@NgModule({
  imports: [
    AuthRoutingModule,
    StoreModule.forFeature(authFeature),
    EffectsModule.forFeature([AuthEffects]),
    MagicLinkLoginLoginFormComponentModule,
    MagicLinkLoginRegisterFormComponentModule,
  ],
  declarations: [LoginComponent, RegisterComponent],
})
export class AuthModule {}
