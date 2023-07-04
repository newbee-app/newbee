import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  InviteEffects,
  InviteService,
} from '@newbee/newbee/invite/data-access';
import { ErrorScreenComponent } from '@newbee/newbee/shared/feature';
import { EffectsModule } from '@ngrx/effects';
import { OrgInviteAcceptComponent } from './org-invite-accept';
import { OrgInviteDeclineComponent } from './org-invite-decline';
import { InviteRoutingModule } from './routing';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([InviteEffects]),
    ErrorScreenComponent,
    InviteRoutingModule,
  ],
  providers: [InviteService],
  declarations: [OrgInviteAcceptComponent, OrgInviteDeclineComponent],
})
export class InviteModule {}
