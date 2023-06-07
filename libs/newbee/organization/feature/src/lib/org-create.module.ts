import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NavbarComponent } from '@newbee/newbee/navbar/feature';
import { organizationFeature } from '@newbee/newbee/organization/data-access';
import { CreateOrgComponent } from '@newbee/newbee/organization/ui';
import { StoreModule } from '@ngrx/store';
import { OrgCreateComponent } from './org-create/org-create.component';
import { OrgCreateRoutingModule } from './routing';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(organizationFeature),
    NavbarComponent,
    CreateOrgComponent,
    OrgCreateRoutingModule,
  ],
  declarations: [OrgCreateComponent],
})
export class OrgCreateModule {}
