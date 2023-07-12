import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authenticatedGuard } from '@newbee/newbee/shared/data-access';
import { authenticatorsResolver } from '@newbee/newbee/user/data-access';
import { UserEditComponent } from '../user-edit';

const routes: Routes = [
  {
    path: '',
    title: 'User',
    canActivate: [authenticatedGuard],
    resolve: { authenticators: authenticatorsResolver },
    component: UserEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
