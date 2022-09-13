# HGF AFJ Workshop 2022

## Prerequisities

- Node.js 16+, Docker, Git

## Installation

Clone repository from https://github.com/jakubkoci/hgf-cloud-agent:

```
git clone https://github.com/jakubkoci/hgf-cloud-agent.git
```

### Build Docker Image

```
cd server
```

Build a Docker image that contains libindy and node_modules. Then we run this docker with our source code as mounted volume. Therefore we can run our code without the need to build or install libindy to our machine.

```
docker build -t hgf-cloud-agent .
```

### Download Docker Image

Project structure:

- client: It's NOT an egde agent. It's just UI for cloud agent. React app built with Next.js, no AFJ needed.
- server: cloud agent, HTTP API, Node.js. Express.js and AFJ.

Why Docker?

## Tutorial

### Initialize Agent

```
// TODO 1. Initialize agent: agent config and instance
```

Setup environment variables. There are predefined values in `.env.example` so we can just copy that:

```
cp .env.example .env
```

We're missing `WALLET_KEY`. The `WALLET_KEY` can be an arbitrary string. It's used for wallet encryption. For production deployments, it should have enough randomness and must be stored very securely.

Start server:

```
docker run -d -v `pwd`:/www -v /www/node_modules -p 3001:3001 --name hgf-cloud-agent hgf-cloud-agent
```

You can show logs and see how it's working.

```
docker logs --follow hgf-cloud-agent
```

Verify that the server is running correctly by accessing some endpoints:

- http://localhost:3001 -> Hello, World!

Other useful commands

```
docker stop hgf-cloud-agent
docker start hgf-cloud-agent
```

### Make a connection

Now it's a good time to start client-side part of our cloud agent. Change directory from `server` to `client`.

```
cd ../client
```

Install dependencies

```
yarn install
```

Run the app in development mode

```
yarn dev
```

The app should be running at http://localhost:3000.

```
// TODO 2. Make a connection
```

You can Create Invitation in the UI and see what's inside by clicking on Show Invitation.

Setup Ngrok or local IP

As you can see, the invitation contains `localhost` which is only available for agents running on your computer. If an agent is running on different device but in the same local network you can change it to IP address of you device in the local network.

A better and recommended option is to use Ngrok. Ngrok gives you publicly accessible HTTP endpoint that works as a proxy to your localhost.

There is short script inside `server` folder that creates ngrok proxy for you. You need to install dependencies.

```
yarn install
```

Now, just open a new terminal window, navigate to `hgf-cloud-agent/server` and run the following command.

```
yarn start:ngrok
```

It's imporant to keep this terminal windown open and script running all the time during the workshop. Ngrok generates a new URL for each run and you would need to change it in your `.env` and restart cloud agent server.

Update `.env` and restart the server

- https://2b12-86-49-228-211.ngrok.io -> Hello, World!

### Issue a credential

Create public DID

- http://localhost:3001/create-did

The public DID seed must be 32 characters long string (16 bytes) and it's used to generate DID and verkey.

Register public DID:

1. [BCovrin Test Indy Network](http://test.bcovrin.vonx.io/)
2. [GreenLight Ledger Indy Network](http://greenlight.bcovrin.vonx.io/)
3. [Get An Indicio Network Endorser!](https://selfserve.indiciotech.io/)
4. [IndyScan BuilderNet Domain Transaction](https://indyscan.io/txs/SOVRIN_BUILDERNET/domain)

Set `PUBLIC_DID_SEED` to `.env.

```
// TODO 3. Register a credential definition
```

```
// TODO 4. Issue a credential
```

### Request a proof

```
// TODO 5. Request a proof
```
