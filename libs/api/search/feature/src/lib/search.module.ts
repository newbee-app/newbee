import { Module } from '@nestjs/common';
import { OrgMemberModule } from '@newbee/api/org-member/feature';
import { SearchService } from '@newbee/api/search/data-access';
import { TeamModule } from '@newbee/api/team/feature';

@Module({
  imports: [TeamModule, OrgMemberModule],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
