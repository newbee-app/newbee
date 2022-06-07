import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class MagicLoginAuthGuard extends AuthGuard('magic-login') {}
