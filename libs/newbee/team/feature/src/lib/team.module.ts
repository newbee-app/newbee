import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  TeamEffects,
  teamFeature,
  TeamService,
} from '@newbee/newbee/team/data-access';
import {
  CreateTeamComponent,
  EditTeamComponent,
  ViewTeamComponent,
  ViewTeamMembersComponent,
  ViewTeamsComponent,
} from '@newbee/newbee/team/ui';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TeamRoutingModule } from './routing';
import { TeamCreateComponent } from './team-create';
import { TeamEditComponent } from './team-edit';
import { TeamMembersViewComponent } from './team-members-view';
import { TeamRootComponent } from './team-root';
import { TeamViewComponent } from './team-view';
import { TeamsViewComponent } from './teams-view';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(teamFeature),
    EffectsModule.forFeature([TeamEffects]),
    CreateTeamComponent,
    ViewTeamComponent,
    EditTeamComponent,
    ViewTeamMembersComponent,
    ViewTeamsComponent,
    TeamRoutingModule,
  ],
  providers: [TeamService],
  declarations: [
    TeamRootComponent,
    TeamCreateComponent,
    TeamViewComponent,
    TeamEditComponent,
    TeamMembersViewComponent,
    TeamsViewComponent,
  ],
})
export class TeamModule {}
