export interface User {
  id: string;
  email: string;
  name: string;
  displayName?: string;
  phoneNumber?: string;
  active: boolean;
  online: boolean;
}
