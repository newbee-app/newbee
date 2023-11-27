import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  createDocTitleResolver,
  docGuard,
  docTitleResolver,
} from '@newbee/newbee/doc/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { Keyword } from '@newbee/shared/util';
import { DocCreateComponent } from '../doc-create';
import { DocRootComponent } from '../doc-root';
import { DocViewComponent } from '../doc-view';

const routes: Routes = [
  {
    path: Keyword.New,
    component: DocCreateComponent,
    title: createDocTitleResolver,
  },
  {
    path: `:${ShortUrl.Doc}`,
    component: DocRootComponent,
    title: docTitleResolver,
    canActivate: [docGuard],
    children: [
      {
        path: '',
        component: DocViewComponent,
      },
    ],
  },
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class DocRoutingModule {}
