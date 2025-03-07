import * as apm from 'elastic-apm-node';
import 'dotenv/config';

export const initAPM = () => {
  apm.start({
    serviceName: 'challenge-gac',
    serverUrl: process.env.ELASTIC_APM_SERVER_URL,
    environment: process.env.NODE_ENV,
    logLevel: 'debug',
    captureBody: 'all',
    captureHeaders: true,
    transactionSampleRate: 1.0,
    verifyServerCert: false,
    disableInstrumentations: [],
    stackTraceLimit: 50,
    metricsInterval: '30s',
  });
};
