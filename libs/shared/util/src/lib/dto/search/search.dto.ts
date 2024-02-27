import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import {
  creatorIsNotEmpty,
  defaultLimit,
  limitIsInt,
  limitMin1,
  maintainerIsNotEmpty,
  offsetIsInt,
  offsetMin0,
  orgMemberIsNotEmpty,
  teamIsNotEmpty,
  typeIsSolrAppEntryEnum,
  typeIsSolrOrgEntryEnum,
} from '../../constant';
import { SolrAppEntryEnum, SolrOrgEntryEnum } from '../../enum';
import { OffsetAndLimit } from '../../interface';
import { CommonSuggestDto } from './suggest.dto';

/**
 * The abstract DTO sent from the frontend to the backend to get search results.
 * Suitable for use in GET requests.
 */
export abstract class CommonSearchDto
  extends CommonSuggestDto
  implements OffsetAndLimit
{
  /**
   * @inheritdoc
   */
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: offsetIsInt })
  @Min(0, { message: offsetMin0 })
  offset = 0;

  /**
   * @inheritdoc
   */
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: limitIsInt })
  @Min(1, { message: limitMin1 })
  limit = defaultLimit;
}

/**
 * The DTO sent from the frontend to the backend to get org search results.
 * Suitable for use in GET requests.
 */
export class OrgSearchDto extends CommonSearchDto {
  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsEnum(SolrOrgEntryEnum, { message: typeIsSolrOrgEntryEnum })
  override type?: SolrOrgEntryEnum;

  /**
   * The slug of the team to limit the search to.
   * Don't specify to search across the entire org.
   * Needs to be a partial instead of a nullable because it will be used in GET requests.
   */
  @IsOptional()
  @IsNotEmpty({ message: teamIsNotEmpty })
  team?: string;

  /**
   * The slug of the org member to limit the search to.
   * Don't specify to search across all creators and maintainers.
   * Needs to be a partial instead of a nullable because it will be used in GET requests.
   */
  @IsOptional()
  @IsNotEmpty({ message: orgMemberIsNotEmpty })
  member?: string;

  /**
   * The slug of the org member creator to limit the search to.
   * Don't specify to search across all creators.
   * Needs to be a partial instead of a nullable because it will be used in GET requests.
   */
  @IsOptional()
  @IsNotEmpty({ message: creatorIsNotEmpty })
  creator?: string;

  /**
   * The slug of the org member maintainer to limit the search to.
   * Don't specify to search across all maintainers.
   * Needs to be a partial instead of a nullable because it will be used in GET requests.
   */
  @IsOptional()
  @IsNotEmpty({ message: maintainerIsNotEmpty })
  maintainer?: string;
}

/**
 * The DTO sent from the frontend to the backend to get app search results.
 * Suitable for use in GET requests.
 */
export class AppSearchDto extends CommonSearchDto {
  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsEnum(SolrAppEntryEnum, { message: typeIsSolrAppEntryEnum })
  override type?: SolrAppEntryEnum;
}
