import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NavbarComponent } from '@newbee/newbee/navbar/feature';
import {
  OrganizationEffects,
  organizationFeature,
  OrganizationService,
} from '@newbee/newbee/organization/data-access';
import { OrgSearchbarComponent } from '@newbee/newbee/organization/ui';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { OrgHomeComponent } from './org-home/org-home.component';
import { OrganizationRoutingModule } from './routing';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(organizationFeature),
    EffectsModule.forFeature([OrganizationEffects]),
    NavbarComponent,
    OrgSearchbarComponent,
    OrganizationRoutingModule,
  ],
  providers: [OrganizationService],
  declarations: [OrgHomeComponent],
})
export class OrganizationModule {}
