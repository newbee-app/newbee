import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  OrganizationEffects,
  organizationFeature,
  OrganizationService,
} from '@newbee/newbee/organization/data-access';
import {
  CreateOrgComponent,
  EditOrgComponent,
  OrgSearchbarComponent,
} from '@newbee/newbee/organization/ui';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { OrgCreateComponent } from './org-create';
import { OrgEditComponent } from './org-edit';
import { OrgHomeComponent } from './org-home/org-home.component';
import { OrgRootComponent } from './org-root';
import { OrganizationRoutingModule } from './routing';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(organizationFeature),
    EffectsModule.forFeature([OrganizationEffects]),
    CreateOrgComponent,
    OrgSearchbarComponent,
    EditOrgComponent,
    OrganizationRoutingModule,
  ],
  providers: [OrganizationService],
  declarations: [
    OrgRootComponent,
    OrgCreateComponent,
    OrgHomeComponent,
    OrgEditComponent,
  ],
})
export class OrganizationModule {}
