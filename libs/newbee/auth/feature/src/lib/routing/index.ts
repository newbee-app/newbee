import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { confirmEmailGuard } from '@newbee/newbee/auth/data-access';
import { Keyword } from '@newbee/shared/util';
import { ConfirmEmailComponent } from '../confirm-email';
import { LoginComponent } from '../login/login.component';
import { MagicLinkLoginComponent } from '../magic-link-login';
import { RegisterComponent } from '../register/register.component';

/**
 * All of the routes associated within the parent `auth` route.
 */
const routes: Routes = [
  {
    path: Keyword.Login,
    title: 'Login',
    children: [
      {
        path: Keyword.ConfirmEmail,
        component: ConfirmEmailComponent,
        canActivate: [confirmEmailGuard],
      },
      {
        path: Keyword.MagicLinkLogin,
        children: [
          {
            path: `:${Keyword.MagicLinkLogin}`,
            component: MagicLinkLoginComponent,
          },
          {
            path: '',
            redirectTo: Keyword.Login,
            pathMatch: 'full',
          },
        ],
      },
      {
        path: '',
        component: LoginComponent,
      },
    ],
  },
  {
    path: Keyword.Register,
    title: 'Register',
    component: RegisterComponent,
  },
  {
    path: '',
    redirectTo: Keyword.Login,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
