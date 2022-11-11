export interface User {
  id: string;
  email: string;
  name: string;
  displayName?: string | null;
  phoneNumber?: string | null;
  active: boolean;
  online: boolean;
}
