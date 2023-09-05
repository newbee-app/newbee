import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  OrgMemberEffects,
  orgMemberFeature,
  OrgMemberService,
} from '@newbee/newbee/org-member/data-access';
import { ViewOrgMemberComponent } from '@newbee/newbee/org-member/ui';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { OrgMemberRootComponent } from './org-member-root';
import { OrgMemberViewComponent } from './org-member-view';
import { OrgMemberRoutingModule } from './routing';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(orgMemberFeature),
    EffectsModule.forFeature([OrgMemberEffects]),
    ViewOrgMemberComponent,
    OrgMemberRoutingModule,
  ],
  providers: [OrgMemberService],
  declarations: [
    OrgMemberRootComponent,
    OrgMemberViewComponent,
    OrgMemberRootComponent,
  ],
})
export class OrgMemberModule {}
