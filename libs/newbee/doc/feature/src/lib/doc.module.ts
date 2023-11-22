import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  DocEffects,
  DocService,
  docFeature,
} from '@newbee/newbee/doc/data-access';
import { CreateDocComponent } from '@newbee/newbee/doc/ui';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DocCreateComponent } from './doc-create';
import { DocRoutingModule } from './routing';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(docFeature),
    EffectsModule.forFeature([DocEffects]),
    CreateDocComponent,
    DocRoutingModule,
  ],
  providers: [DocService],
  declarations: [DocCreateComponent],
})
export class DocModule {}
