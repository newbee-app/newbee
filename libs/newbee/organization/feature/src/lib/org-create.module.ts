import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NavbarComponent } from '@newbee/newbee/navbar/feature';
import { CreateOrgComponent } from '@newbee/newbee/organization/ui';
import { OrgCreateComponent } from './org-create/org-create.component';
import { OrgCreateRoutingModule } from './routing';

@NgModule({
  imports: [
    CommonModule,
    NavbarComponent,
    CreateOrgComponent,
    OrgCreateRoutingModule,
  ],
  declarations: [OrgCreateComponent],
})
export class OrgCreateModule {}
