const { logger, tracer } = require('./instrumentation');
const { SeverityNumber } = require('@opentelemetry/api-logs');

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.emit({
      severityNumber: SeverityNumber.INFO,
      severityText: 'INFO',
      body: `${req.method} ${req.originalUrl} ${res.statusCode}`,
      attributes: {
        'http.method': req.method,
        'http.route': req.originalUrl,
        'http.status_code': res.statusCode,
        'http.duration_ms': Date.now() - start,
      },
    });
  });
  next();
});

app.get('/', (req, res) => {
  const span = tracer.startSpan('GET /');
  span.setAttribute('http.method', 'GET');
  span.setAttribute('http.route', '/');
  res.json({ message: 'Hello from OpenTelemetry Express app!' });
  span.end();
});

app.get('/health', (req, res) => {
  const span = tracer.startSpan('GET /health');
  span.setAttribute('http.method', 'GET');
  span.setAttribute('http.route', '/health');
  res.json({ status: 'ok' });
  span.end();
});

app.get('/api/items', (req, res) => {
  const span = tracer.startSpan('GET /api/items');
  span.setAttribute('http.method', 'GET');
  span.setAttribute('http.route', '/api/items');
  const items = [
    { id: 1, name: 'Item One' },
    { id: 2, name: 'Item Two' },
    { id: 3, name: 'Item Three' },
  ];
  span.setAttribute('items.count', items.length);
  res.json(items);
  span.end();
});

app.get('/api/error', (req, res) => {
  const span = tracer.startSpan('GET /api/error');
  span.setAttribute('http.method', 'GET');
  span.setAttribute('http.route', '/api/error');
  span.setAttribute('error.type', 'InternalServerError');
  span.setStatus({ code: 2, message: 'Something went wrong' });
  res.status(500).json({ error: 'Something went wrong' });
  span.end();
});

app.listen(PORT, () => {
  logger.emit({
    severityNumber: SeverityNumber.INFO,
    severityText: 'INFO',
    body: `Server running on port ${PORT}`,
  });
  console.log(`Server running on port ${PORT}`);
});
