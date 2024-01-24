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
import { ViewPostsComponent } from '@newbee/newbee/shared/ui';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { OrgMemberDocsViewComponent } from './org-member-docs-view';
import { OrgMemberQnasViewComponent } from './org-member-qnas-view';
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
    ViewPostsComponent,
    OrgMemberRoutingModule,
  ],
  providers: [OrgMemberService],
  declarations: [
    OrgMemberRootComponent,
    OrgMemberViewComponent,
    OrgMembersViewComponent,
    OrgMemberTeamsViewComponent,
    OrgMemberDocsViewComponent,
    OrgMemberQnasViewComponent,
  ],
})
export class OrgMemberModule {}
