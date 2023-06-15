import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { orgTitleResolver } from '@newbee/newbee/organization/data-access';
import { UrlEndpoint } from '@newbee/shared/data-access';
import { OrgEditComponent } from '../org-edit';
import { OrgHomeComponent } from '../org-home';

const routes: Routes = [
  {
    path: '',
    title: orgTitleResolver,
    children: [
      {
        path: '',
        component: OrgHomeComponent,
      },
      {
        path: UrlEndpoint.Edit,
        component: OrgEditComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationRoutingModule {}
