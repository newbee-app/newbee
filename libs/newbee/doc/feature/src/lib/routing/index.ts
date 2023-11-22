import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { createDocTitleResolver } from '@newbee/newbee/doc/data-access';
import { Keyword } from '@newbee/shared/util';
import { DocCreateComponent } from '../doc-create';

const routes: Routes = [
  {
    path: Keyword.New,
    component: DocCreateComponent,
    title: createDocTitleResolver,
  },
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class DocRoutingModule {}
