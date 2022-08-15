import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from '../user';

export class MagicLinkLoginLoginDto extends PickType(CreateUserDto, [
  'email',
] as const) {}
