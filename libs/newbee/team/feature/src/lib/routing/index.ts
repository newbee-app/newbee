import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  canEditTeamGuard,
  createTeamTitleResolver,
  teamGuard,
  teamTitleResolver,
  teamsTitleResolver,
} from '@newbee/newbee/team/data-access';
import { Keyword } from '@newbee/shared/util';
import { TeamCreateComponent } from '../team-create';
import { TeamDocsViewComponent } from '../team-docs-view';
import { TeamEditComponent } from '../team-edit';
import { TeamMembersViewComponent } from '../team-members-view';
import { TeamQnasViewComponent } from '../team-qnas-view';
import { TeamRootComponent } from '../team-root';
import { TeamViewComponent } from '../team-view';
import { TeamsViewComponent } from '../teams-view';

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
        path: ShortUrl.Member,
        component: TeamMembersViewComponent,
      },
      {
        path: ShortUrl.Doc,
        component: TeamDocsViewComponent,
      },
      {
        path: ShortUrl.Qna,
        component: TeamQnasViewComponent,
      },
      {
        path: '',
        component: TeamViewComponent,
      },
    ],
  },
  {
    path: '',
    component: TeamsViewComponent,
    title: teamsTitleResolver,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamRoutingModule {}
