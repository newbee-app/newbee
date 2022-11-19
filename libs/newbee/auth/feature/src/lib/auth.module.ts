import { NgModule } from '@angular/core';
import {
  AuthEffects,
  authFeature,
  AuthService,
} from '@newbee/newbee/auth/data-access';
import {
  LoginFormComponentModule,
  RegisterFormComponentModule,
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
    LoginFormComponentModule,
    RegisterFormComponentModule,
  ],
  providers: [AuthService],
  declarations: [LoginComponent, RegisterComponent],
})
export class AuthModule {}
