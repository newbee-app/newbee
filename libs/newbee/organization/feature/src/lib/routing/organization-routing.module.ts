import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { orgTitleResolver } from '@newbee/newbee/organization/data-access';
import { OrgHomeComponent } from '../org-home/org-home.component';

const routes: Routes = [
  {
    path: '',
    title: orgTitleResolver,
    component: OrgHomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationRoutingModule {}
