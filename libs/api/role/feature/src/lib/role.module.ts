import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { RoleService } from '@newbee/api/role/data-access';
import { RoleEntity } from '@newbee/api/shared/data-access';

@Module({
  imports: [MikroOrmModule.forFeature([RoleEntity])],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
