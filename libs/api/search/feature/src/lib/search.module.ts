import { Module } from '@nestjs/common';
import { OrganizationModule } from '@newbee/api/organization/feature';
import { SearchService } from '@newbee/api/search/data-access';
import { SearchController } from './search.controller';

@Module({
  imports: [OrganizationModule],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
