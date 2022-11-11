import { testUserEntity1 } from '@newbee/api/shared/data-access';
import { testPublicKeyCredentialCreationOptions1 } from '@newbee/shared/util';
import { UserAndOptions } from '../interface';

export const testUserAndOptions1: UserAndOptions = {
  user: testUserEntity1,
  options: testPublicKeyCredentialCreationOptions1,
};
