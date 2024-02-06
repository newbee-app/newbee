import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authenticatedGuard } from '@newbee/newbee/shared/data-access';
import { authenticatorsResolver } from '@newbee/newbee/user/data-access';
import { Keyword } from '@newbee/shared/util';
import { UserEditComponent } from '../user-edit';
import { UserEmailVerifyComponent } from '../user-email-verify';

const routes: Routes = [
  {
    path: Keyword.Verify,
    children: [
      {
        path: `:${Keyword.Verify}`,
        title: 'Verify email',
        component: UserEmailVerifyComponent,
      },
      { path: '', redirectTo: `/${Keyword.User}`, pathMatch: 'full' },
    ],
  },
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
