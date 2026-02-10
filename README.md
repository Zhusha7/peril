# Peril

**Peril is a toy environment I use for learning Pub/Sub architecture using AMQP.**

The project is using RabbitMQ message broker, however, due to it's nature, Peril requires minimal changes to support any other message broker that supports the Advanced Message Queuing Protocol (AMQP) and requires minimal changes to code.

The list of supported message brokers includes:

- RabbitMQ (Obviously)
- ActiveMQ
- Qpid
- Solace
- Azure Service Bus

The starter code is ported from Boot.dev's course on Pub/Sub architecture with RabbitMQ. As explained in their course, **Peril** is a make-believe clone of the classic game "Risk".

## Instructions

### Do this if this is your first install

Clone this repository

```bash
git clone https://github.com/zhusha7/peril.git
```

Next, install all required npm packages

```bash
npm i
```

Use the npm script included with startup project to setup RabbitMQ docker container

```bash
npm run rabbit:start
```

**Important!** You need to setup 2-3 durable exchanges in RabbitMQ management UI for the code to work. `peril_dlx` can be excuded:

![alt text](/readme_screenshots/image.png)

Go to <http://localhost:15672/#/exchanges>

The default username and password is `guest`

Create 3 queues with settings shown on a screenshot.

### Client and server startups

Start up a server

```bash
npm run server
```

Start up a client

```bash
npm run client
```

### Once you are done, don't forget to stop the container

To stop the docker container, run

```bash
npm run rabbit:stop
```

### Additional information

You can start multiple servers using an included bash script

```bash
./src/scripts/multiserver.sh 100
```

Change the number to specify how many server you would like to start up. This is included to handle logs, which take 1s to "process". Now you can use `spam 10000` in the client REPL to spam 10000 log messages. Logs are saved on disk.

If exchanges are created as instructed, the message queue will survive even if a RabbitMQ server is restarted.

### Current status of this project

This project is "complete". It demonstrates the usage of RabbitMQ and AMQP and is not supposed to solve a specific problem, but rather demonstrate the functionallity of Pub/Sub style of exchanging data between services.
