import { IsNotEmpty, IsOptional, Matches } from 'class-validator';
import {
  docIsNotEmpty,
  iso8601DurationRegex,
  maintainerIsNotEmpty,
  teamIsNotEmpty,
  titleIsNotEmpty,
  upToDateDurationMatches,
} from '../../constant';
import { CreateDocDto } from './create-doc.dto';

/**
 * The DTO sent from the frontend to the backend to update a Doc.
 * Suitable for use in PATCH requests.
 */
export class UpdateDocDto implements Partial<CreateDocDto> {
  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: titleIsNotEmpty })
  readonly title?: string;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @Matches(iso8601DurationRegex, { message: upToDateDurationMatches })
  readonly upToDateDuration?: string | null;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: docIsNotEmpty })
  readonly docMarkdoc?: string;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: teamIsNotEmpty })
  readonly team?: string | null;

  /**
   * The slug of the org member to make the doc's maintainer.
   */
  @IsOptional()
  @IsNotEmpty({ message: maintainerIsNotEmpty })
  readonly maintainer?: string;

  constructor(obj: UpdateDocDto) {
    Object.assign(this, obj);
  }
}
