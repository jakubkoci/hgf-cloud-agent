# HGF AFJ Workshop 2022

## Prerequisities
* Node.js 16+, Docker, Git

## Installation
* Repo https://github.com/jakubkoci/hgf-cloud-agent
```
git clone https://github.com/jakubkoci/hgf-cloud-agent.git
```

* Explain project structure, server (Node.js backend with Express and AFJ), client (React app with Next.js, no AFJ deps)

* Server: docker build, ngrok, env file, docker run, yarn install

```
cd server
docker build -t hgf-cloud-agent .
```

* Register DID
[BCovrin Test Indy Network](http://test.bcovrin.vonx.io/)
[Get a Sovrin Network Endorser!](https://selfserve.sovrin.org/)

* Setup `.env`
```
touch .env
```

* Start server
```
docker run -v `pwd`:/www -v /www/node_modules -p 3001:3001 --name hgf-cloud-agent hgf-cloud-agent

yarn install
```

* Verify it’s running 

http://localhost:3001/ -> Hello, World!
http://localhost:3001/did -> did and verkey
http://localhost:3001/invitation -> [decode base64 invitation](https://codebeautify.org/base64-decode)

https://2b12-86-49-228-211.ngrok.io -> Hello, World!
https://2b12-86-49-228-211.ngrok.io/did -> did and verkey

* Ngrok
```
yarn ts-node start-tunnel.ts
```
Update `.env` and restart server

* Other useful commands
```
docker logs --follow hgf-cloud-agent
docker stop hgf-cloud-agent
docker start hgf-cloud-agent
```

* Client: 
```
cd client
yarn install
yarn dev
```
