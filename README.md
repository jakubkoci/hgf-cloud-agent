<h1 align="center">How To Build a Self-Sovereign Identity Agent With Hyperledger Aries Framework JavaScript</h1>
<h4 align="center">14 September 2022 | 09:00 - 12:30</h4>
<h5 align="center">Jakub Koci, Timo Glastra and Berend Sliedrecht</h5>
<p align="center">
<br>
<br>
<br>
<img
  alt="Hyperledger Aries logo"
  src="https://raw.githubusercontent.com/hyperledger/aries-framework-javascript/aa31131825e3331dc93694bc58414d955dcb1129/images/aries-logo.png"
  height="250px"
/>
<br>
<br>
<br>
</p>

Link to our discord: https://discord.gg/VkmcsFTH

Link to the Hyperledger Global Forum Channel: https://discord.com/channels/905194001349627914/1017366759168286753

## Table of content

- Prerequisites
- Installation
- Context
- Section 1: Agent initialization
- Section 2: Create an invitation
- Section 3: Issue a credential
- Section 4: Request a proof

## Prerequisites

- Node.js 16+ https://nodejs.org/en/download/
- Git https://git-scm.com
- Docker

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

If you have Apple M1 processor use `Dockerfile.arm`:

```
docker build -f Dockerfile.arm -t hgf-cloud-agent .
```

### Download Docker Image

There is a publicly available Docker image [jakubkoci/hgf-cloud-agent](https://hub.docker.com/repository/docker/jakubkoci/hgf-cloud-agent).

```
docker pull jakubkoci/hgf-cloud-agent:latest
```

### Install Dependencies

```
yarn
```

### Build App

```
yarn build
```

## Context

- Project structure:
  - client: It's NOT an egde agent. It's just UI for cloud agent. React app built with Next.js, no AFJ needed.
  - server: cloud agent, HTTP API, Node.js. Express.js and AFJ.
- Why Docker?

## Section 1: Agent initialization

Let's start with `startApp` function and let's look what does it want from us and what we can put into it:
- label, only required
- logger, because we're curious
- walletConfig
- endpoints, because we can

```
// TODO Section 1: Agent Initialization (agent instance, config, deps and transports)
```

The wallet key is quite secret thing (it's actually very secret thing).For production deployments, it should have enough randomness and must be stored very securely. We should not hardcoded into our code.

There is already prepared `.env.example` file containing also other config params, so we can just copy that and update values.

```
cp .env.example .env
```

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

Other useful commands:

```
docker stop hgf-cloud-agent
docker start hgf-cloud-agent
```

## Section 2: Create an invitation

### UI

Now it's a good time to start client-side part of our cloud agent. Change directory from `server` to `client`.

```
cd ../client
```

Install dependencies

```
yarn
```

Run the app in development mode

```
yarn dev
```

The app should be running at http://localhost:3000.

```
// TODO Section 2: Create an invitation
```

You can Create Invitation in the UI and see what's inside by clicking on Show Invitation.

### Setup Ngrok or local IP

As you can see, the invitation contains `localhost` which is only available for agents running on your computer. If an agent is running on different device but in the same local network you can change it to IP address of you device in the local network.

A better and recommended option is to use Ngrok. Ngrok gives you publicly accessible HTTP endpoint that works as a proxy to your localhost.

There is short script inside `server` folder that creates ngrok proxy for you. You need to install dependencies.

Now, just open a new terminal window, navigate to `hgf-cloud-agent/server` and run the following command.

```
yarn start:ngrok
```

It's imporant to keep this terminal windown open and script running all the time during the workshop. Ngrok generates a new URL for each run and you would need to change it in your `.env` and restart cloud agent server.

Update `.env` and restart the server

- https://2b12-86-49-228-211.ngrok.io -> Hello, World!

## Section 3: Issue a credential

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
// TODO Section 3: Issue a credential (register a credential definition)
```

```
// TODO Section 3: Issue a credential
```

## Section 4: Request a proof

```
// TODO Section 4: Request a proof
```
