import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthenticatedHomeComponent } from '@newbee/newbee/home/ui';
import { HomeComponent } from './home/home.component';
import { HomeRoutingModule } from './routing';

@NgModule({
  imports: [CommonModule, AuthenticatedHomeComponent, HomeRoutingModule],
  declarations: [HomeComponent],
})
export class HomeModule {}
