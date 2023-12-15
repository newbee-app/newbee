import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  canEditTeamGuard,
  createTeamTitleResolver,
  teamGuard,
  teamTitleResolver,
} from '@newbee/newbee/team/data-access';
import { Keyword } from '@newbee/shared/util';
import { TeamCreateComponent } from '../team-create';
import { TeamEditComponent } from '../team-edit';
import { TeamRootComponent } from '../team-root';
import { TeamViewComponent } from '../team-view';

const routes: Routes = [
  {
    path: Keyword.New,
    component: TeamCreateComponent,
    title: createTeamTitleResolver,
  },
  {
    path: `:${ShortUrl.Team}`,
    component: TeamRootComponent,
    title: teamTitleResolver,
    canActivate: [teamGuard],
    children: [
      {
        path: Keyword.Edit,
        component: TeamEditComponent,
        canActivate: [canEditTeamGuard],
      },
      {
        path: '',
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
