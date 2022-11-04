import { NameDisplayFormat } from '../enum';
import { Authenticator, User, UserSettings } from '../interface';

export const testAuthenticator1: Authenticator = {
  id: '1',
  credentialId: 'cred1',
  credentialPublicKey: Buffer.from('credpk1', 'utf-8'),
  counter: 0,
  credentialDeviceType: 'singleDevice',
  credentialBackedUp: true,
};

export const testUserSettings1: UserSettings = {
  userId: '1',
  nameDisplayFormat: NameDisplayFormat.FIRST_LAST,
};

export const testUser1: User = {
  id: '1',
  email: 'johndoe@example.com',
  name: 'John Doe',
  displayName: 'John',
  active: true,
  online: false,
};
