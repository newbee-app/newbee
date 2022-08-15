import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { magicLinkLogin } from '@newbee/shared/util';

@Injectable()
export class MagicLinkLoginAuthGuard extends AuthGuard(magicLinkLogin) {}
