import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  DocEffects,
  DocService,
  docFeature,
} from '@newbee/newbee/doc/data-access';
import { CreateDocComponent, ViewDocComponent } from '@newbee/newbee/doc/ui';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DocCreateComponent } from './doc-create';
import { DocRootComponent } from './doc-root';
import { DocViewComponent } from './doc-view';
import { DocRoutingModule } from './routing';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(docFeature),
    EffectsModule.forFeature([DocEffects]),
    CreateDocComponent,
    ViewDocComponent,
    DocRoutingModule,
  ],
  providers: [DocService],
  declarations: [DocCreateComponent, DocRootComponent, DocViewComponent],
})
export class DocModule {}
