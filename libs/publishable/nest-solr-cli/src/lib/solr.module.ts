import { Global, Module } from '@nestjs/common';
import { SolrCli, SolrCliOptions } from '@newbee/solr-cli';
import { SolrModuleClass, SOLR_MODULE_OPTIONS } from './solr.module-definition';

@Global()
@Module({
  providers: [
    {
      provide: SolrCli,
      useFactory: (options: SolrCliOptions) => {
        return new SolrCli(options);
      },
      inject: [SOLR_MODULE_OPTIONS],
    },
  ],
  exports: [SolrCli],
})
export class SolrModule extends SolrModuleClass {}
