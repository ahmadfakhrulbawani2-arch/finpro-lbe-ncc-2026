import { watch } from 'node:fs';

const clients = new Set();

const server = Bun.serve({
  port: 3000,

  async fetch(req, server) {
    const url = new URL(req.url);

    // Hot reload connection
    if (url.pathname === '/__reload') {
      const upgraded = server.upgrade(req);

      if (upgraded) {
        return;
      }

      return new Response('WebSocket upgrade failed', {
        status: 400,
      });
    }

    let pathname = decodeURIComponent(url.pathname);

    if (pathname === '/') {
      pathname = '/index.html';
    }

    const file = Bun.file(`.${pathname}`);

    if (!(await file.exists())) {
      return new Response('Not Found', {
        status: 404,
      });
    }

    return new Response(file);
  },

  websocket: {
    open(ws) {
      clients.add(ws);
    },

    close(ws) {
      clients.delete(ws);
    },
  },
});

// Watch project files
watch(
  '.',
  {
    recursive: true,
  },
  (event, filename) => {
    if (!filename) return;

    if (filename.includes('node_modules') || filename.includes('.git')) {
      return;
    }

    console.log(`Changed: ${filename}`);

    for (const client of clients) {
      client.send('reload');
    }
  }
);

console.log(`http://localhost:${server.port}`);
