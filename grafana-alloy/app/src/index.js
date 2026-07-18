const { logger } = require('./instrumentation');
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
  res.json({ message: 'Hello from OpenTelemetry Express app!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/items', (req, res) => {
  const items = [
    { id: 1, name: 'Item One' },
    { id: 2, name: 'Item Two' },
    { id: 3, name: 'Item Three' },
  ];
  res.json(items);
});

app.get('/api/error', (req, res) => {
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
  logger.emit({
    severityNumber: SeverityNumber.INFO,
    severityText: 'INFO',
    body: `Server running on port ${PORT}`,
  });
  console.log(`Server running on port ${PORT}`);
});
