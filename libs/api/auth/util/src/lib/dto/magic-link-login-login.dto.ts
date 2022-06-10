import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from '@newbee/api/user/util';

export class MagicLinkLoginLoginDto extends PickType(CreateUserDto, [
  'email',
] as const) {}
