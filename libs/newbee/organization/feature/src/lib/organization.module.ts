import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  OrganizationEffects,
  organizationFeature,
  OrganizationService,
} from '@newbee/newbee/organization/data-access';
import {
  CreateOrgComponent,
  EditOrgComponent,
  InviteMemberComponent,
  OrgSearchbarComponent,
} from '@newbee/newbee/organization/ui';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { OrgCreateComponent } from './org-create';
import { OrgEditComponent } from './org-edit';
import { OrgHomeComponent } from './org-home/org-home.component';
import { OrgInviteComponent } from './org-invite';
import { OrganizationRoutingModule } from './routing';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(organizationFeature),
    EffectsModule.forFeature([OrganizationEffects]),
    CreateOrgComponent,
    OrgSearchbarComponent,
    EditOrgComponent,
    InviteMemberComponent,
    OrganizationRoutingModule,
  ],
  providers: [OrganizationService],
  declarations: [
    OrgCreateComponent,
    OrgHomeComponent,
    OrgEditComponent,
    OrgInviteComponent,
  ],
})
export class OrganizationModule {}
