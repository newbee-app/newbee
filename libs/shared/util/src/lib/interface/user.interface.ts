export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  phoneNumber?: string;
  active: boolean;
  online: boolean;
  fullName: string;
}
