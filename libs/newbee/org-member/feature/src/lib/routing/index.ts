import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  orgMemberGuard,
  orgMemberTitleResolver,
  orgMembersTitleResolver,
} from '@newbee/newbee/org-member/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { OrgMemberDocsViewComponent } from '../org-member-docs-view';
import { OrgMemberQnasViewComponent } from '../org-member-qnas-view';
import { OrgMemberRootComponent } from '../org-member-root';
import { OrgMemberTeamsViewComponent } from '../org-member-teams-view';
import { OrgMemberViewComponent } from '../org-member-view';
import { OrgMembersViewComponent } from '../org-members-view';

const routes: Routes = [
  {
    path: `:${ShortUrl.Member}`,
    component: OrgMemberRootComponent,
    title: orgMemberTitleResolver,
    canActivate: [orgMemberGuard],
    children: [
      {
        path: ShortUrl.Team,
        component: OrgMemberTeamsViewComponent,
      },
      {
        path: ShortUrl.Doc,
        component: OrgMemberDocsViewComponent,
      },
      {
        path: ShortUrl.Qna,
        component: OrgMemberQnasViewComponent,
      },
      {
        path: '',
        component: OrgMemberViewComponent,
      },
    ],
  },
  {
    path: '',
    component: OrgMembersViewComponent,
    title: orgMembersTitleResolver,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrgMemberRoutingModule {}
