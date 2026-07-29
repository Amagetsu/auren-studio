import { createServer } from 'node:http';
import { sendContact } from './contact.js';

createServer(async (request, response) => {
  if (request.method === 'POST' && request.url === '/api/contact') {
    try { const result = await sendContact(request); response.writeHead(result.status || 200, { 'Content-Type': 'application/json' }); response.end(JSON.stringify(result)); } catch { response.writeHead(500, { 'Content-Type': 'application/json' }); response.end(JSON.stringify({ ok: false })); }
    return;
  }
  response.writeHead(404); response.end();
}).listen(process.env.PORT || 8787);
