import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  QnaEffects,
  QnaService,
  qnaFeature,
} from '@newbee/newbee/qna/data-access';
import { CreateQnaComponent, ViewQnaComponent } from '@newbee/newbee/qna/ui';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { QnaCreateComponent } from './qna-create';
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
    QnaRoutingModule,
  ],
  providers: [QnaService],
  declarations: [QnaRootComponent, QnaCreateComponent, QnaViewComponent],
})
export class QnaModule {}
