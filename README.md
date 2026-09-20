# finpro-lbe-ncc-2026

A final project for my LBE NCC 2026 Assignment. The final project is about making portfolio website then deployed to Microsoft Azuere Resource Group with Docker and Load Balancer.

![screenshot](./docs/localhost_3000_%20wide.png)

## Prerequisites

1. Node JS or Bun
2. Docker Engine and Docker Compose
3. Git

## 🧑‍💻 How to Run Locally

1. Clone this repo

```bash
git clone https://github.com/ahmadfakhrulbawani2-arch/finpro-lbe-ncc-2026.git
cd finpro-lbe-ncc-2026
```

2. Uncomment this part in [index.html](./index.html):

```html
<script>
  const socket = new WebSocket(`ws://${location.host}/__reload`);

  socket.addEventListener('message', (event) => {
    if (event.data === 'reload') {
      location.reload();
    }
  });
</script>
```

3. Run using node or bun

```bash
node server.js
# or
bun server.js
```
