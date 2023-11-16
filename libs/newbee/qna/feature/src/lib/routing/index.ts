import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  createQnaTitleResolver,
  qnaGuard,
  qnaTitleResolver,
} from '@newbee/newbee/qna/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { Keyword } from '@newbee/shared/util';
import { QnaCreateComponent } from '../qna-create';
import { QnaRootComponent } from '../qna-root';
import { QnaViewComponent } from '../qna-view';

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
        path: '',
        component: QnaViewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QnaRoutingModule {}
