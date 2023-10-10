import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  QnaEffects,
  QnaService,
  qnaFeature,
} from '@newbee/newbee/qna/data-access';
import { CreateQnaComponent } from '@newbee/newbee/qna/ui';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { QnaCreateComponent } from './qna-create';
import { QnaRoutingModule } from './routing';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(qnaFeature),
    EffectsModule.forFeature([QnaEffects]),
    CreateQnaComponent,
    QnaRoutingModule,
  ],
  providers: [QnaService],
  declarations: [QnaCreateComponent],
})
export class QnaModule {}
