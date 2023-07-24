import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CreateOrgComponent } from '@newbee/newbee/organization/ui';
import { OrgCreateComponent } from './org-create/org-create.component';
import { OrgCreateRoutingModule } from './routing';

@NgModule({
  imports: [CommonModule, CreateOrgComponent, OrgCreateRoutingModule],
  declarations: [OrgCreateComponent],
})
export class OrgCreateModule {}
