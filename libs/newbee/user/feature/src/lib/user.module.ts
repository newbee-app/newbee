import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NavbarComponent } from '@newbee/newbee/navbar/feature';
import {
  UserEffects,
  userFeature,
  UserService,
} from '@newbee/newbee/user/data-access';
import { EditUserComponent } from '@newbee/newbee/user/ui';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { UserRoutingModule } from './routing';
import { UserEditComponent } from './user-edit';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(userFeature),
    EffectsModule.forFeature([UserEffects]),
    NavbarComponent,
    EditUserComponent,
    UserRoutingModule,
  ],
  providers: [UserService],
  declarations: [UserEditComponent],
})
export class UserModule {}
