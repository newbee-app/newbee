import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { OrganizationService } from '@newbee/api/organization/data-access';
import { OrganizationEntity } from '@newbee/api/shared/data-access';
import { OrganizationController } from './organization.controller';

@Module({
  imports: [MikroOrmModule.forFeature([OrganizationEntity])],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
