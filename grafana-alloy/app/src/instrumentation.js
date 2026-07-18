const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-grpc');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-grpc');
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
const { Resource } = require('@opentelemetry/resources');
const { SEMRESATTRS_SERVICE_NAME } = require('@opentelemetry/semantic-conventions');
const { logs } = require('@opentelemetry/api-logs');

const sdk = new NodeSDK({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'express-app',
  }),
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://alloy:4317',
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://alloy:4317',
    }),
    exportIntervalMillis: 10000,
  }),
  logExporter: new OTLPLogExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://alloy:4317',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

const logger = logs.getLogger('express-app');

process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('OTEL SDK shut down'))
    .catch((err) => console.error('Error shutting down OTEL SDK', err))
    .finally(() => process.exit(0));
});

module.exports = { logger };
