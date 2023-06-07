import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UrlEndpoint } from '@newbee/shared/data-access';
import { OrgCreateComponent } from '../org-create/org-create.component';

const routes: Routes = [
  {
    path: UrlEndpoint.New,
    component: OrgCreateComponent,
    title: 'Create org',
  },
  {
    path: '',
    redirectTo: UrlEndpoint.New,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrgCreateRoutingModule {}
