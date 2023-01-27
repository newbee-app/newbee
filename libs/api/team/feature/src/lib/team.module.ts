import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { OrganizationModule } from '@newbee/api/organization/feature';
import { TeamEntity } from '@newbee/api/shared/data-access';
import { TeamService } from '@newbee/api/team/data-access';
import { UserOrganizationModule } from '@newbee/api/user-organization/feature';
import { TeamController } from './team.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([TeamEntity]),
    OrganizationModule,
    UserOrganizationModule,
  ],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
