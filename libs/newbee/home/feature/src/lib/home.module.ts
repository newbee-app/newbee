import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NoOrgComponent, NoOrgSelectedComponent } from '@newbee/newbee/home/ui';
import { NavbarComponent } from '@newbee/newbee/navbar/feature';
import { HomeComponent } from './home/home.component';
import { HomeRoutingModule } from './routing';

@NgModule({
  imports: [
    CommonModule,
    NavbarComponent,
    NoOrgComponent,
    NoOrgSelectedComponent,
    HomeRoutingModule,
  ],
  declarations: [HomeComponent],
})
export class HomeModule {}
