import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authenticatedGuard } from '@newbee/newbee/shared/data-access';
import { UrlEndpoint } from '@newbee/shared/data-access';
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
        path: `${UrlEndpoint.Accept}/:${UrlEndpoint.Invite}`,
        component: OrgInviteAcceptComponent,
      },
      {
        path: `${UrlEndpoint.Decline}/:${UrlEndpoint.Invite}`,
        component: OrgInviteDeclineComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InviteRoutingModule {}
