import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  SearchEffects,
  SearchService,
} from '@newbee/newbee/search/data-access';
import { SearchResultsComponent } from '@newbee/newbee/search/ui';
import { EffectsModule } from '@ngrx/effects';
import { SearchRoutingModule } from './routing';
import { SearchResultsViewComponent } from './search-results-view';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([SearchEffects]),
    SearchResultsComponent,
    SearchRoutingModule,
  ],
  declarations: [SearchResultsViewComponent],
  providers: [SearchService],
})
export class SearchModule {}
