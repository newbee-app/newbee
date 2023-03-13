import { ConfigurableModuleBuilder } from '@nestjs/common';
import type { SolrCliOptions } from '@newbee/solr-cli';

export const {
  ConfigurableModuleClass: SolrModuleClass,
  MODULE_OPTIONS_TOKEN: SOLR_MODULE_OPTIONS,
} = new ConfigurableModuleBuilder<SolrCliOptions>()
  .setClassMethodName('forRoot')
  .build();
