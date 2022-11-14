import { User } from '@newbee/shared/util';

export class BaseEmailDto implements Pick<User, 'email'> {
  email!: string;
}
