import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { queryIsNotEmpty, typeIsEnum } from '../../constant';
import { SolrEntryEnum } from '../../enum';

/**
 * The DTO sent from the frontend to the backend to get query suggestions.
 * Suitable for use in GET requests.
 */
export class SuggestDto {
  /**
   * The query itself.
   */
  @IsNotEmpty({ message: queryIsNotEmpty })
  query = '';

  /**
   * The type of entry to look for.
   * Don't specify to search in all.
   * Needs to be a partial instead of a nullable because it will be used in GET requests.
   */
  @IsOptional()
  @IsEnum(SolrEntryEnum, { message: typeIsEnum })
  type?: SolrEntryEnum;
}
