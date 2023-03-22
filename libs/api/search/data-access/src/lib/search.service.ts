import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchService {
  /**
   * The logger to use when logging anything in the service.
   */
  // private readonly logger = new Logger(SearchService.name);
  // constructor(private readonly solrCli: SolrCli) {}
  // async query(organization: OrganizationEntity, queryDto: QueryDto): Promise<> {
  //   try {
  //     const solrRes = await this.solrCli.query(organization.id, queryDto);
  //   } catch (err) {
  //     this.logger.error(err);
  //     throw new InternalServerErrorException(internalServerError);
  //   }
  // }
}
