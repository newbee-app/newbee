import { User } from '@newbee/shared/util';

export class BaseUpdateUserDto implements Partial<Omit<User, 'id'>> {
  email?: string;
  name?: string;
  displayName?: string | null;
  phoneNumber?: string | null;
  active?: boolean;
  online?: boolean;
}
