import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShortUrl } from '@newbee/newbee/shared/data-access';
import {
  resetSelectedTeamGuard,
  teamTitleResolver,
} from '@newbee/newbee/team/data-access';
import { Keyword } from '@newbee/shared/util';
import { TeamCreateComponent } from '../team-create';
import { TeamViewComponent } from '../team-view';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: Keyword.New,
        component: TeamCreateComponent,
      },
      {
        path: `:${ShortUrl.Team}`,
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
