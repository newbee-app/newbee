import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { TeamEntity } from '@newbee/api/shared/data-access';
import { TeamService } from '@newbee/api/team/data-access';
import { TeamController } from './team.controller';

@Module({
  imports: [MikroOrmModule.forFeature([TeamEntity])],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
