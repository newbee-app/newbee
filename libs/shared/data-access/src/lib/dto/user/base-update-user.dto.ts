import { BaseCreateUserDto } from './base-create-user.dto';

export class BaseUpdateUserDto implements Partial<BaseCreateUserDto> {
  email?: string;
  name?: string;
  displayName?: string;
  phoneNumber?: string;
}
