import { User } from '../interface';

const testId1 = '1';
const testEmail1 = 'johndoe@example.com';
const testFirstName1 = 'John';
const testLastName1 = 'Doe';
const testActive1 = true;
const testOnline1 = false;
const testFullName1 = `${testFirstName1} ${testLastName1}`;

export const testUser1: User = {
  id: testId1,
  email: testEmail1,
  firstName: testFirstName1,
  lastName: testLastName1,
  active: testActive1,
  online: testOnline1,
  fullName: testFullName1,
};
