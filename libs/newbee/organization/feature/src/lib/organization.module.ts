import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NavbarComponent } from '@newbee/newbee/navbar/feature';
import {
  OrganizationEffects,
  organizationFeature,
  OrganizationService,
} from '@newbee/newbee/organization/data-access';
import {
  EditOrgComponent,
  OrgSearchbarComponent,
} from '@newbee/newbee/organization/ui';
import { ErrorScreenComponent } from '@newbee/newbee/shared/feature';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { OrgEditComponent } from './org-edit';
import { OrgHomeComponent } from './org-home/org-home.component';
import { OrganizationRoutingModule } from './routing';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(organizationFeature),
    EffectsModule.forFeature([OrganizationEffects]),
    NavbarComponent,
    OrgSearchbarComponent,
    EditOrgComponent,
    ErrorScreenComponent,
    OrganizationRoutingModule,
  ],
  providers: [OrganizationService],
  declarations: [OrgHomeComponent, OrgEditComponent],
})
export class OrganizationModule {}
