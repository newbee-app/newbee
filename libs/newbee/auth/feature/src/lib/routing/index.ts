import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  confirmEmailGuard,
  magicLinkLoginGuard,
} from '@newbee/newbee/auth/data-access';
import { ConfirmEmailComponent } from '../confirm-email';
import { LoginComponent } from '../login/login.component';
import { MagicLinkLoginComponent } from '../magic-link-login';
import { RegisterComponent } from '../register/register.component';

const routes: Routes = [
  {
    path: 'login',
    title: 'Login',
    component: LoginComponent,
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
    ],
  },
  {
    path: 'register',
    title: 'Register',
    component: RegisterComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
