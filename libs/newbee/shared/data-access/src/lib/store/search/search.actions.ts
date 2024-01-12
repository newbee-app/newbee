import {
  BaseQueryDto,
  BaseSuggestDto,
  BaseSuggestResultsDto,
  Keyword,
  QueryResults,
} from '@newbee/shared/util';
import { createActionGroup, props } from '@ngrx/store';

/**
 * All actions tied to `SearchState`.
 */
export const SearchActions = createActionGroup({
  source: Keyword.Search,
  events: {
    /**
     * Send a search request to the API.
     * Should call `Search Success` with the result.
     */
    Search: props<{ query: BaseQueryDto }>(),

    /**
     * Indicates that the results of a search query were successfully retrieved.
     */
    'Search Success': props<{ results: QueryResults }>(),

    /**
     * Send a request to the API asking for query suggestions based on the query thus far.
     * Should call `Suggest Success` with the result.
     */
    Suggest: props<{ query: BaseSuggestDto }>(),

    /**
     * Indicates that the results of a suggest query were successfully retrieved.
     */
    'Suggest Success': props<{ results: BaseSuggestResultsDto }>(),
  },
});
