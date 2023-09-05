import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  orgMemberGuard,
  orgMemberTitleResolver,
} from '@newbee/newbee/org-member/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { OrgMemberRootComponent } from '../org-member-root';
import { OrgMemberViewComponent } from '../org-member-view';

const routes: Routes = [
  {
    path: `:${ShortUrl.Member}`,
    component: OrgMemberRootComponent,
    title: orgMemberTitleResolver,
    canActivate: [orgMemberGuard],
    children: [
      {
        path: '',
        component: OrgMemberViewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrgMemberRoutingModule {}
