import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { confirmEmailGuard } from '@newbee/newbee/auth/data-access';
import { UrlEndpoint } from '@newbee/shared/data-access';
import { magicLinkLogin } from '@newbee/shared/util';
import { ConfirmEmailComponent } from '../confirm-email';
import { LoginComponent } from '../login/login.component';
import { MagicLinkLoginComponent } from '../magic-link-login';
import { RegisterComponent } from '../register/register.component';

/**
 * All of the routes associated within the parent `auth` route.
 */
const routes: Routes = [
  {
    path: UrlEndpoint.Login,
    title: 'Login',
    children: [
      {
        path: UrlEndpoint.ConfirmEmail,
        component: ConfirmEmailComponent,
        canActivate: [confirmEmailGuard],
      },
      {
        path: magicLinkLogin,
        children: [
          {
            path: `:${magicLinkLogin}`,
            component: MagicLinkLoginComponent,
          },
          {
            path: '',
            redirectTo: UrlEndpoint.Login,
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
    path: UrlEndpoint.Register,
    title: 'Register',
    component: RegisterComponent,
  },
  {
    path: '',
    redirectTo: UrlEndpoint.Login,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
