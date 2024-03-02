import { SolrCliOptions } from '@newbee/solr-cli';

const solrCliOptions: SolrCliOptions = {
  url: process.env['SOLR_URL'] as string,
  basicAuth: {
    username: process.env['SOLR_USERNAME'] as string,
    password: process.env['SOLR_PASSWORD'] as string,
  },
};

export default solrCliOptions;
