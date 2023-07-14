import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NavbarComponent } from '@newbee/newbee/navbar/feature';
import {
  TeamEffects,
  teamFeature,
  TeamService,
} from '@newbee/newbee/team/data-access';
import { CreateTeamComponent } from '@newbee/newbee/team/ui';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TeamRoutingModule } from './routing';
import { TeamCreateComponent } from './team-create';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(teamFeature),
    EffectsModule.forFeature([TeamEffects]),
    NavbarComponent,
    CreateTeamComponent,
    TeamRoutingModule,
  ],
  providers: [TeamService],
  declarations: [TeamCreateComponent],
})
export class TeamModule {}
