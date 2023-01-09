import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  AuthEffects,
  authFeature,
  AuthService,
} from '@newbee/newbee/auth/data-access';
import {
  JwtIdComponentModule,
  LoginFormComponentModule,
  RegisterFormComponentModule,
} from '@newbee/newbee/auth/ui';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ConfirmEmailComponent } from './confirm-email';
import { LoginComponent } from './login';
import { MagicLinkLoginComponent } from './magic-link-login';
import { RegisterComponent } from './register';
import { AuthRoutingModule } from './routing';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(authFeature),
    EffectsModule.forFeature([AuthEffects]),
    JwtIdComponentModule,
    LoginFormComponentModule,
    RegisterFormComponentModule,
    AuthRoutingModule,
  ],
  providers: [AuthService],
  declarations: [
    ConfirmEmailComponent,
    LoginComponent,
    RegisterComponent,
    MagicLinkLoginComponent,
  ],
})
export class AuthModule {}
