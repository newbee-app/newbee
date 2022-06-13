import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from '@newbee/api/user/util';
import { IsDefined, IsUUID } from 'class-validator';

export class UserJwtDto extends PickType(CreateUserDto, ['email'] as const) {
  @IsDefined()
  @IsUUID()
  sub!: string; // user id
}
