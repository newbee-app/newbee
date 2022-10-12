import { NameDisplayFormat } from '../enum';
import { User, UserSettings } from '../interface';

export const testUserSettings1: UserSettings = {
  id: '1',
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
