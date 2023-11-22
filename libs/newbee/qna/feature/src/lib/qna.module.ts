import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  QnaEffects,
  QnaService,
  qnaFeature,
} from '@newbee/newbee/qna/data-access';
import {
  CreateQnaComponent,
  EditQnaComponent,
  ViewQnaComponent,
} from '@newbee/newbee/qna/ui';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { QnaCreateComponent } from './qna-create';
import { QnaEditComponent } from './qna-edit';
import { QnaRootComponent } from './qna-root';
import { QnaViewComponent } from './qna-view';
import { QnaRoutingModule } from './routing';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(qnaFeature),
    EffectsModule.forFeature([QnaEffects]),
    CreateQnaComponent,
    ViewQnaComponent,
    EditQnaComponent,
    QnaRoutingModule,
  ],
  providers: [QnaService],
  declarations: [
    QnaRootComponent,
    QnaCreateComponent,
    QnaViewComponent,
    QnaEditComponent,
  ],
})
export class QnaModule {}
