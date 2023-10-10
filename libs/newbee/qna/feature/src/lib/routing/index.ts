import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { createQnaTitleResolver } from '@newbee/newbee/qna/data-access';
import { Keyword } from '@newbee/shared/util';
import { QnaCreateComponent } from '../qna-create';

const routes: Routes = [
  {
    path: Keyword.New,
    component: QnaCreateComponent,
    title: createQnaTitleResolver,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QnaRoutingModule {}
