import { User } from '@newbee/shared/util';
import { IsDefined, IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateUserDto
  implements Omit<User, 'id' | 'active' | 'online' | 'fullName'>
{
  @IsDefined()
  @IsEmail()
  email!: string;

  @IsDefined()
  firstName!: string;

  @IsDefined()
  lastName!: string;

  @IsOptional()
  displayName?: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;
}
