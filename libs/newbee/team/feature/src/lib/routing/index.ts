import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  resetSelectedTeamGuard,
  teamTitleResolver,
} from '@newbee/newbee/team/data-access';
import { UrlEndpoint } from '@newbee/shared/data-access';
import { TeamCreateComponent } from '../team-create';
import { TeamViewComponent } from '../team-view';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: UrlEndpoint.New,
        component: TeamCreateComponent,
      },
      {
        path: `:${UrlEndpoint.Team}`,
        title: teamTitleResolver,
        canDeactivate: [resetSelectedTeamGuard],
        component: TeamViewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamRoutingModule {}
