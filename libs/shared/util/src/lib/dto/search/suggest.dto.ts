import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import {
  queryIsNotEmpty,
  typeIsNotEmpty,
  typeIsSolrAppEntryEnum,
  typeIsSolrOrgEntryEnum,
} from '../../constant';
import { SolrAppEntryEnum, SolrOrgEntryEnum } from '../../enum';

/**
 * The abstract DTO sent from the frontend to the backend to get query suggestions.
 * Suitable for use in GET requests.
 */
export abstract class CommonSuggestDto {
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
  @IsNotEmpty({ message: typeIsNotEmpty })
  type?: string;
}

/**
 * The DTO sent from the frontend to the backend to get org query suggestions.
 * Suitable for use in GET requests.
 */
export class OrgSuggestDto extends CommonSuggestDto {
  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsEnum(SolrOrgEntryEnum, { message: typeIsSolrOrgEntryEnum })
  override type?: SolrOrgEntryEnum;
}

/**
 * The DTO sent from the frontend to the backend to get app query suggestions.
 * Suitable for use in GET requests.
 */
export class AppSuggestDto extends CommonSuggestDto {
  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsEnum(SolrAppEntryEnum, { message: typeIsSolrAppEntryEnum })
  override type?: SolrAppEntryEnum;
}
