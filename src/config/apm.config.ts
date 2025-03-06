import * as apm from 'elastic-apm-node';

export const initAPM = () => {
  apm.start({
    serviceName: 'challenge-gac',
    serverUrl: 'http://localhost:8200',
    environment: process.env.NODE_ENV || 'development',
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
