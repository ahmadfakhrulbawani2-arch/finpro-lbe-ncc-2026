# ncc-team-09-lbe-final

> [!Info]
>
> A presentation readme is [here](./PRESENTATION.md)

A final project for my LBE NCC 2026 Assignment. The final project is about making portfolio website then deployed to Microsoft Azuere Resource Group with Docker and Load Balancer.

## Prerequisites

1. Node JS or Bun
2. Docker Engine and Docker Compose
3. Git

## 🧑‍💻 How to Run Locally

0. Fix docker permission by adding your username (only if you never do this)

```bash
sudo usermod -aG docker $USER
newgrp docker
```

1. Build docker images

```bash
cd app/
docker build --tag ncc-team-09 ./
```

2. Create and run docker container with spesific `VM_HOSTNAME` env. See which `VM_HOSTNAME` name is permitted [here](./app/entrypoint.sh). TL;DR the permitted name is the name of each website folder name

web-1: in your `localhost:8080`

```bash
docker run \
    --detach \
    --publish 8080:8080 \
    --env VM_HOSTNAME="<your_vm_hostname>" \
    --name <your_vm_hostname>-web \
    ncc-team-09
```

web-2: in your `localhost:8081`

```bash
docker run \
    --detach \
    --publish 8081:8080 \
    --env VM_HOSTNAME="<your_vm_hostname>" \
    --name <your_vm_hostname>-web \
    ncc-team-09
```

And so on, basically set different `VM_HOSTNAME` and host post.

3. Congrats, you'll be able to see each website in each port
