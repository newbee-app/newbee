import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  TeamEffects,
  teamFeature,
  TeamService,
} from '@newbee/newbee/team/data-access';
import { CreateTeamComponent, ViewTeamComponent } from '@newbee/newbee/team/ui';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TeamRoutingModule } from './routing';
import { TeamCreateComponent } from './team-create';
import { TeamViewComponent } from './team-view';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(teamFeature),
    EffectsModule.forFeature([TeamEffects]),
    CreateTeamComponent,
    ViewTeamComponent,
    TeamRoutingModule,
  ],
  providers: [TeamService],
  declarations: [TeamCreateComponent, TeamViewComponent],
})
export class TeamModule {}
