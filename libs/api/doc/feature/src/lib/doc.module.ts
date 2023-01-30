import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { DocService } from '@newbee/api/doc/data-access';
import { OrganizationModule } from '@newbee/api/organization/feature';
import { DocEntity } from '@newbee/api/shared/data-access';
import { TeamModule } from '@newbee/api/team/feature';
import { UserOrganizationModule } from '@newbee/api/user-organization/feature';
import { DocController } from './doc.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([DocEntity]),
    OrganizationModule,
    UserOrganizationModule,
    TeamModule,
  ],
  providers: [DocService],
  controllers: [DocController],
  exports: [DocService],
})
export class DocModule {}
