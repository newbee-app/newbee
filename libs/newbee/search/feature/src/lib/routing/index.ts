import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  searchGuard,
  searchTitleResolver,
} from '@newbee/newbee/search/data-access';
import { Keyword } from '@newbee/shared/util';
import { SearchResultsViewComponent } from '../search-results-view';

const routes: Routes = [
  {
    path: `:${Keyword.Search}`,
    component: SearchResultsViewComponent,
    title: searchTitleResolver,
    canActivate: [searchGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchRoutingModule {}
