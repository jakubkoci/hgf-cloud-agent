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
git clone https://github.com/jakubkoci/hgf-cloud-agent.git cloud-agent
git clone https://github.com/jakubkoci/hgf-cloud-agent.git holder-agent
```

### Build Docker Image

```
cd cloud-agent/server
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
cp .env.cloud-agent.example .env
```

Create local docker network:

```
docker network create cloud-agents
```

Start server:

```
docker run -d -v `pwd`:/www -v /www/node_modules -p 3001:3001 --name cloud-agent --network cloud-agents hgf-cloud-agent
```

You can show logs and see how it's working.

```
docker logs --follow hgf-cloud-agent
```

Verify that the server is running correctly by accessing some endpoints:

- http://localhost:3001 -> Hello, World!

Other useful commands:

```
docker network inspect cloud-agents

docker stop cloud-agent
docker start cloud-agent
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

Build the client app for cloud agent server endpoint:

```
CLOUD_AGENT_API_URL=http://localhost:3001 yarn build
```

Start the client app defining on a different port than server:

```
yarn start -p 3000
```

The app should be running at http://localhost:3000.

```
// TODO Section 2: Create an invitation
```

You can Create Invitation in the UI and see what's inside by clicking on Show Invitation.

---

## Section 2: Prepare Holder and Accept Invitation

```
cd holder-agent/server
```

```
cp .env.holder-agent.example .env
```

```
docker run -d -v `pwd`:/www -v /www/node_modules -p 3003:3003 --name holder-agent --network cloud-agents hgf-cloud-agent
```

```
cd ../client
```

Install dependencies

```
yarn
```

Build the client app for holder agent server endpoint:

```
CLOUD_AGENT_API_URL=http://localhost:3003 yarn build
```

Start the client app defining on a different port than server:

```
yarn start -p 3002
```

The app should be running at http://localhost:3000.

---

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
