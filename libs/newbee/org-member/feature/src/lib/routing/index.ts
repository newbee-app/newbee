import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  orgMemberGuard,
  orgMemberTitleResolver,
  resetSelectedOrgMemberGuard,
} from '@newbee/newbee/org-member/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { OrgMemberViewComponent } from '../org-member-view';

const routes: Routes = [
  {
    path: `:${ShortUrl.Member}`,
    component: OrgMemberViewComponent,
    title: orgMemberTitleResolver,
    canActivate: [orgMemberGuard],
    canDeactivate: [resetSelectedOrgMemberGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrgMemberRoutingModule {}
