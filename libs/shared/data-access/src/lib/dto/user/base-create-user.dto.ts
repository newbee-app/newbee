import { User } from '@newbee/shared/util';

export class BaseCreateUserDto
  implements Omit<User, 'id' | 'active' | 'online'>
{
  email!: string;
  name!: string;
  displayName: string | null = null;
  phoneNumber: string | null = null;
}
