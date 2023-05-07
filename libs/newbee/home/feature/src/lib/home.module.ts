import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthenticatedHomeComponent } from '@newbee/newbee/home/ui';
import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [CommonModule, AuthenticatedHomeComponent],
  declarations: [HomeComponent],
})
export class HomeModule {}
