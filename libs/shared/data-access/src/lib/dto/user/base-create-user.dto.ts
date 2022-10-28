import { User } from '@newbee/shared/util';

export class BaseCreateUserDto
  implements Omit<User, 'id' | 'active' | 'online'>
{
  email!: string;
  name!: string;
  displayName?: string;
  phoneNumber?: string;
}
