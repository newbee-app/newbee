import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UrlEndpoint } from '@newbee/shared/data-access';
import { TeamCreateComponent } from '../team-create';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: UrlEndpoint.New,
        component: TeamCreateComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamRoutingModule {}
