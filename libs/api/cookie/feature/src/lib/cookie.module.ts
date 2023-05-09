import { Module } from '@nestjs/common';
import { AuthModule } from '@newbee/api/auth/feature';
import { UserModule } from '@newbee/api/user/feature';
import { CookieController } from './cookie.controller';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [CookieController],
})
export class CookieModule {}
