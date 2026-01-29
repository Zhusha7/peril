# Peril

**Peril is a toy environment I use for learning Pub/Sub architecture using AMQP.**

The project is using RabbitMQ message broker, however, due to it's nature, Peril requires minimal changes to support any other message broker that supports the Advanced Message Queuing Protocol (AMQP). The only change required is the connection string to a message broker.

The list of supported message brokers includes:

- RabbitMQ (Obviously)
- ActiveMQ
- Qpid
- Solace
- Azure Service Bus

The starter code is ported from Boot.dev's course on Pub/Sub architecture with RabbitMQ. As explained in their course, **Peril** is a make-believe clone of the classic game "Risk".

## Instructions

To use this code, please clone this repository

```bash
git clone https://github.com/zhusha7/peril.git
```

Next, install all required npm packages

```bash
npm i
```

Use the script included with startup project to setup RabbitMQ docker container

```bash
npm run rabbit:start
```

Start up a server

```bash
npm run server
```

Start up a client

```bash
npm run client
```

To stop the docker container, run

```bash
npm run rabbit:stop
```

### Current status of this project

Unfortunately, this project is still incomplete. Please come back once I have fully grasped the concepts of Pub/Sub architecture and message brokers like RabbitMQ.
