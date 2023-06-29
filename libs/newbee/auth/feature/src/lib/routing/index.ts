import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  confirmEmailGuard,
  magicLinkLoginGuard,
} from '@newbee/newbee/auth/data-access';
import { UrlEndpoint } from '@newbee/shared/data-access';
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
        path: 'confirm-email',
        component: ConfirmEmailComponent,
        canActivate: [confirmEmailGuard],
      },
      {
        path: 'magic-link-login',
        component: MagicLinkLoginComponent,
        canActivate: [magicLinkLoginGuard],
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
