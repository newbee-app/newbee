import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { magicLinkLogin } from '@newbee/shared/util';

/**
 * The `AuthGuard` for the Magic Link Login Strategy.
 */
@Injectable()
export class MagicLinkLoginAuthGuard extends AuthGuard(magicLinkLogin) {}
