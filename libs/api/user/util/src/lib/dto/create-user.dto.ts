export class CreateUserDto {
  email!: string;
  firstName!: string;
  lastName!: string;
  displayName?: string;
  phoneNumber?: string;
}
