import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { WaitlistMemberEntity } from '@newbee/api/shared/data-access';
import { UserInvitesModule } from '@newbee/api/user-invites/feature';
import { UserModule } from '@newbee/api/user/feature';
import { WaitlistMemberService } from '@newbee/api/waitlist-member/data-access';

@Module({
  imports: [
    MikroOrmModule.forFeature([WaitlistMemberEntity]),
    UserInvitesModule,
    UserModule,
  ],
  providers: [WaitlistMemberService],
  exports: [WaitlistMemberService],
})
export class WaitlistMemberModule {}
