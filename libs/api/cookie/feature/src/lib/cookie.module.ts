import { Module } from '@nestjs/common';
import { AuthModule } from '@newbee/api/auth/feature';
import { CookieController } from './cookie.controller';

@Module({
  imports: [AuthModule],
  controllers: [CookieController],
})
export class CookieModule {}
