import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  canEditQnaGuard,
  createQnaTitleResolver,
  qnaGuard,
  qnaTitleResolver,
  qnasTitleResolver,
} from '@newbee/newbee/qna/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { Keyword } from '@newbee/shared/util';
import { QnaCreateComponent } from '../qna-create';
import { QnaEditComponent } from '../qna-edit';
import { QnaRootComponent } from '../qna-root';
import { QnaViewComponent } from '../qna-view';
import { QnasViewComponent } from '../qnas-view';

const routes: Routes = [
  {
    path: Keyword.New,
    component: QnaCreateComponent,
    title: createQnaTitleResolver,
  },
  {
    path: `:${ShortUrl.Qna}`,
    component: QnaRootComponent,
    title: qnaTitleResolver,
    canActivate: [qnaGuard],
    children: [
      {
        path: Keyword.Edit,
        component: QnaEditComponent,
        canActivate: [canEditQnaGuard],
      },
      {
        path: '',
        component: QnaViewComponent,
      },
    ],
  },
  {
    path: '',
    component: QnasViewComponent,
    title: qnasTitleResolver,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QnaRoutingModule {}
