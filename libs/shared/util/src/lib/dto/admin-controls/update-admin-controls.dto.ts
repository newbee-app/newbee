import { IsBoolean, IsOptional } from 'class-validator';
import {
  allowRegistrationIsBoolean,
  allowWaitlistIsBoolean,
} from '../../constant';
import { AdminControls } from '../../interface';

/**
 * The DTO sent from the frontend to the backend for updating admin controls.
 * Suitable for use in PATCH requests.
 */
export class UpdateAdminControlsDto implements Partial<AdminControls> {
  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsBoolean({ message: allowRegistrationIsBoolean })
  readonly allowRegistration?: boolean;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsBoolean({ message: allowWaitlistIsBoolean })
  readonly allowWaitlist?: boolean;

  constructor(obj: UpdateAdminControlsDto) {
    Object.assign(this, obj);
  }
}
