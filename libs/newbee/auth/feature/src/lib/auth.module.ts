import { NgModule } from '@angular/core';
import { AuthEffects } from '@newbee/newbee/auth/data-access';
import { authFeature } from '@newbee/newbee/shared/data-access';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';
import { AuthRoutingModule } from './routing';

@NgModule({
  imports: [
    LoginModule,
    RegisterModule,
    AuthRoutingModule,
    StoreModule.forFeature(authFeature),
    EffectsModule.forFeature([AuthEffects]),
  ],
})
export class AuthModule {}
