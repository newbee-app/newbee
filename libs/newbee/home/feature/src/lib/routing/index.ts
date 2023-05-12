import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authenticatedGuard } from '@newbee/newbee/shared/data-access';
import { HomeComponent } from '../home/home.component';

const routes: Routes = [
  {
    path: '',
    title: 'Home',
    component: HomeComponent,
    canActivate: [authenticatedGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
