import { Module } from '@nestjs/common';
import { SearchService } from '@newbee/api/search/data-access';
import { SearchController } from './search.controller';

@Module({
  imports: [],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
