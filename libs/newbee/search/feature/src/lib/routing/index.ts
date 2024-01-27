import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { searchTitleResolver } from '@newbee/newbee/search/data-access';
import { relativeRedirectGuard } from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { Keyword } from '@newbee/shared/util';
import { SearchResultsViewComponent } from '../search-results-view';

const routes: Routes = [
  {
    path: `:${Keyword.Search}`,
    component: SearchResultsViewComponent,
    title: searchTitleResolver,
  },
  {
    path: '',
    component: EmptyComponent,
    canActivate: [relativeRedirectGuard({ route: '..' })],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchRoutingModule {}
