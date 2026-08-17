const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const orders = [
  { id: 1, product: 'Laptop', amount: 1200 },
  { id: 2, product: 'Mouse', amount: 25 },
  { id: 3, product: 'Keyboard', amount: 45 },
];

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.get('/api/orders/:id', (req, res) => {
  const order = orders.find((o) => o.id === Number(req.params.id));
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

app.listen(PORT, () => {
  console.log(`Orders API listening on port ${PORT}`);
});