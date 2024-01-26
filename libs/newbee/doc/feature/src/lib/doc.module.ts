import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  DocEffects,
  DocService,
  docFeature,
} from '@newbee/newbee/doc/data-access';
import {
  CreateDocComponent,
  EditDocComponent,
  ViewDocComponent,
} from '@newbee/newbee/doc/ui';
import { ViewPostsComponent } from '@newbee/newbee/shared/ui';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DocCreateComponent } from './doc-create';
import { DocEditComponent } from './doc-edit';
import { DocRootComponent } from './doc-root';
import { DocViewComponent } from './doc-view';
import { DocsViewComponent } from './docs-view';
import { DocRoutingModule } from './routing';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(docFeature),
    EffectsModule.forFeature([DocEffects]),
    ViewPostsComponent,
    CreateDocComponent,
    ViewDocComponent,
    EditDocComponent,
    DocRoutingModule,
  ],
  providers: [DocService],
  declarations: [
    DocCreateComponent,
    DocRootComponent,
    DocViewComponent,
    DocEditComponent,
    DocsViewComponent,
  ],
})
export class DocModule {}
