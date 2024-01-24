import {
  BaseQueryDto,
  BaseQueryResultsDto,
  BaseSuggestDto,
  BaseSuggestResultsDto,
  Keyword,
} from '@newbee/shared/util';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

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
    'Search Success': props<{ results: BaseQueryResultsDto }>(),

    /**
     * Send a request to the API asking for query suggestions based on the query thus far.
     * Should call `Suggest Success` with the result.
     */
    Suggest: props<{ query: BaseSuggestDto }>(),

    /**
     * Indicates that the results of a suggest query were successfully retrieved.
     */
    'Suggest Success': props<{ results: BaseSuggestResultsDto }>(),

    /**
     * Send a search request to the API, which should be a continuation of a previous search request.
     * Should call `Continue Search Success` with the result.
     */
    'Continue Search': emptyProps(),

    /**
     * Indicates that more results of a previous search query were successfully retrieved.
     */
    'Continue Search Success': props<{ results: BaseQueryResultsDto }>(),
  },
});
