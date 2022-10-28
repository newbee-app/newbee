import type { User } from '@newbee/shared/util';

export class BaseLoginDto {
  access_token!: string;
  user!: User;
}
