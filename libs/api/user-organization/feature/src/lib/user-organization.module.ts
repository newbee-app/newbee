import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UserOrganizationEntity } from '@newbee/api/shared/data-access';
import { UserOrganizationService } from '@newbee/api/user-organization/data-access';

@Module({
  imports: [MikroOrmModule.forFeature([UserOrganizationEntity])],
  providers: [UserOrganizationService],
  exports: [UserOrganizationService],
})
export class UserOrganizationModule {}
