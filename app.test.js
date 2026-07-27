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

function postJson(server, path, payload) {
  return new Promise((resolve, reject) => {
    const { port } = server.address();
    const body = JSON.stringify(payload);
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
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

test('GET /time returns iso and unix time', async () => {
  const server = app.listen(0);
  try {
    const res = await request(server, '/time');
    assert.strictEqual(res.status, 200);
    assert.ok(typeof res.body.iso === 'string');
    assert.ok(typeof res.body.unix === 'number');
  } finally {
    server.close();
  }
});

test('POST /echo returns the body that was sent', async () => {
  const server = app.listen(0);
  try {
    const res = await postJson(server, '/echo', { hello: 'world' });
    assert.strictEqual(res.status, 200);
    assert.deepStrictEqual(res.body.youSent, { hello: 'world' });
  } finally {
    server.close();
  }
});
