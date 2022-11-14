import { BaseEmailDto } from '@newbee/shared/data-access';
import { IsDefined, IsEmail } from 'class-validator';

export class EmailDto implements BaseEmailDto {
  @IsDefined()
  @IsEmail()
  email!: string;
}
