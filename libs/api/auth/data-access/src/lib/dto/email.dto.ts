import { BaseEmailDto } from '@newbee/shared/data-access';
import { IsEmail } from 'class-validator';

export class EmailDto implements BaseEmailDto {
  @IsEmail()
  email!: string;
}
