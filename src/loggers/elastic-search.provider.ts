import { Client } from '@elastic/elasticsearch';
import { Provider } from '@nestjs/common';

export const ElasticsearchProvider: Provider = {
  provide: 'ELASTICSEARCH_CLIENT',
  useFactory: () => {
    return new Client({
      node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
      auth: {
        username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
        password: process.env.ELASTICSEARCH_PASSWORD || 'changeme',
      },
    });
  },
};
