# HGF AFJ Workshop 2022

## Prerequisities

- Node.js 16+, Docker, Git

## Installation

Clone repository from https://github.com/jakubkoci/hgf-cloud-agent:

```
git clone https://github.com/jakubkoci/hgf-cloud-agent.git
```

Project structure:

- client: It's NOT an egde agent. It's just UI for cloud agent. React app built with Next.js, no AFJ needed.
- server: cloud agent, HTTP API, Node.js. Express.js and AFJ.

### Server

```
cd server
```

Build a Docker image that contains libindy and node_modules. Then we run this docker with our source code as mounted volume. Therefore we can run our code without the need to build or install libindy to our machine.

```
docker build -t hgf-cloud-agent .
```

Setup environment variables. There are predefined values in `.env.example` so we can just copy that:

```
cp .env.example .env
```

We're missing `WALLET_KEY` and `PUBLIC_DID_SEED`. The `WALLET_KEY` can be an arbitrary string. It's used for wallet encryption. For production deployments, it should have enough randomness and must be stored very securely.

The `PUBLIC_DID_SEED` must be 32 characters long string (16 bytes) used to generate DID and verkey.


To generate DID and verey from seed we can use [BCovrin Test Indy Network](http://test.bcovrin.vonx.io/). We can then use DID and verkey to register it on Sovrin BuilderNet [Get a Sovrin Network Endorser!](https://selfserve.sovrin.org/). You can check if you registered the DID succesfully in [IndyScan BuilderNet Domain Transaction](https://indyscan.io/txs/SOVRIN_BUILDERNET/domain).

Start server:

```
docker run -d -v `pwd`:/www -v /www/node_modules -p 3001:3001 --name hgf-cloud-agent hgf-cloud-agent
```

You can show logs and see how it's working.

```
docker logs --follow hgf-cloud-agent
```

Verify that the server is running correctly by accessing some endpoints:

- http://localhost:3001/ -> Hello, World!
- http://localhost:3001/did -> did and verkey
- http://localhost:3001/invitation -> [decode base64 invitation](https://codebeautify.org/base64-decode)

Setup Ngrok or local IP

As you can see, the invitation contains `localhost` which is only available for agents running on your computer. If an agent is running on different device but in the same local network you can change it to IP address of you device in the local network.

A better and recommended option is to use Ngrok. Ngrok gives you publicly accessible HTTP endpoint that works as a proxy to your localhost.

There is short script inside `server` folder that creates ngrok proxy for you. You need to install dependencies.

```
yarn install
```

Now, just open a new terminal window, navigate to `hgf-cloud-agent/server` and run the following command.

```
yarn ts-node start-tunnel.ts
```

It's imporant to keep this terminal windown open and script running all the time during the workshop. Ngrok generates a new URL for each run and you would need to change it in your `.env` and restart cloud agent server.

Update `.env` and restart the server

- https://2b12-86-49-228-211.ngrok.io -> Hello, World!
- https://2b12-86-49-228-211.ngrok.io/did -> did and verkey

Other useful commands

```
docker stop hgf-cloud-agent
docker start hgf-cloud-agent
```

### Client

Change directory from `server` to `client`.

```
cd ../client
```

Install dependencies

```
yarn install
```

Run the app in dev mode

```
yarn dev
```

The app should be running at http://localhost:3000.
