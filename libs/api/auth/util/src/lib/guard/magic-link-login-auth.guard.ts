import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { magicLinkLogin } from '../constant';

@Injectable()
export class MagicLinkLoginAuthGuard extends AuthGuard(magicLinkLogin) {}
