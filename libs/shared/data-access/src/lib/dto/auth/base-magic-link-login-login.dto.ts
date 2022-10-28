import { User } from '@newbee/shared/util';

export class BaseMagicLinkLoginLoginDto implements Pick<User, 'email'> {
  email!: string;
}
