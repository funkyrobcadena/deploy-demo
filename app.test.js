const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const app = require('../app');

function request(server, path) {
  return new Promise((resolve, reject) => {
    const { port } = server.address();
    http.get(`http://127.0.0.1:${port}${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    }).on('error', reject);
  });
}

test('GET /health returns ok', async () => {
  const server = app.listen(0);
  try {
    const res = await request(server, '/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'ok');
  } finally {
    server.close();
  }
});

test('GET / returns a greeting message', async () => {
  const server = app.listen(0);
  try {
    const res = await request(server, '/');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.message.includes('Hello'));
  } finally {
    server.close();
  }
});
