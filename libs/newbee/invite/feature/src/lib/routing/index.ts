import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authenticatedGuard } from '@newbee/newbee/shared/data-access';
import { Keyword } from '@newbee/shared/util';
import { OrgInviteAcceptComponent } from '../org-invite-accept';
import { OrgInviteDeclineComponent } from '../org-invite-decline';

/**
 * All of the routes associated with the parent invite route.
 */
const routes: Routes = [
  {
    path: '',
    title: 'Invite',
    canActivate: [authenticatedGuard],
    children: [
      {
        path: `${Keyword.Accept}/:${Keyword.Invite}`,
        component: OrgInviteAcceptComponent,
      },
      {
        path: `${Keyword.Decline}/:${Keyword.Invite}`,
        component: OrgInviteDeclineComponent,
      },
      {
        path: '',
        redirectTo: '/',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InviteRoutingModule {}
