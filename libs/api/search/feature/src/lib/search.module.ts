import { Module } from '@nestjs/common';
import { SearchService } from '@newbee/api/search/data-access';
import { TeamModule } from '@newbee/api/team/feature';
import { SearchController } from './search.controller';

@Module({
  imports: [TeamModule],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
