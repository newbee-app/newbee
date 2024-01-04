import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  OrgMemberEffects,
  orgMemberFeature,
  OrgMemberService,
} from '@newbee/newbee/org-member/data-access';
import {
  ViewOrgMemberComponent,
  ViewOrgMembersComponent,
  ViewOrgMemberTeamsComponent,
} from '@newbee/newbee/org-member/ui';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { OrgMemberRootComponent } from './org-member-root';
import { OrgMemberTeamsViewComponent } from './org-member-teams-view';
import { OrgMemberViewComponent } from './org-member-view';
import { OrgMembersViewComponent } from './org-members-view';
import { OrgMemberRoutingModule } from './routing';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(orgMemberFeature),
    EffectsModule.forFeature([OrgMemberEffects]),
    ViewOrgMemberComponent,
    ViewOrgMembersComponent,
    ViewOrgMemberTeamsComponent,
    OrgMemberRoutingModule,
  ],
  providers: [OrgMemberService],
  declarations: [
    OrgMemberRootComponent,
    OrgMemberViewComponent,
    OrgMembersViewComponent,
    OrgMemberTeamsViewComponent,
  ],
})
export class OrgMemberModule {}
