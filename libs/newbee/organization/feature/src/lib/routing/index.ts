import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  isOrgAdminGuard,
  orgGuard,
  orgTitleResolver,
  resetSelectedOrgGuard,
} from '@newbee/newbee/organization/data-access';
import { authenticatedGuard } from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { Keyword } from '@newbee/shared/util';
import { OrgCreateComponent } from '../org-create';
import { OrgEditComponent } from '../org-edit';
import { OrgHomeComponent } from '../org-home';
import { OrgInviteComponent } from '../org-invite';

const routes: Routes = [
  {
    path: Keyword.New,
    component: OrgCreateComponent,
    title: 'Create org',
  },
  {
    path: `:${ShortUrl.Organization}`,
    title: orgTitleResolver,
    canActivate: [authenticatedGuard, orgGuard],
    canDeactivate: [resetSelectedOrgGuard],
    children: [
      {
        path: ShortUrl.Team,
        loadChildren: async () => {
          const m = await import('@newbee/newbee/team/feature');
          return m.TeamModule;
        },
      },
      {
        path: ShortUrl.Member,
        loadChildren: async () => {
          const m = await import('@newbee/newbee/org-member/feature');
          return m.OrgMemberModule;
        },
      },
      {
        path: Keyword.Edit,
        component: OrgEditComponent,
        canActivate: [isOrgAdminGuard],
      },
      {
        path: Keyword.Invite,
        component: OrgInviteComponent,
        canActivate: [isOrgAdminGuard],
      },
      {
        path: '',
        component: OrgHomeComponent,
      },
    ],
  },
  {
    path: '',
    redirectTo: Keyword.New,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationRoutingModule {}
