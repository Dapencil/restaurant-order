#!/usr/bin/env node

let amqp = require("amqplib/callback_api");
let args = process.argv.slice(2);
let queues = args.map((arg) => `order-${arg.toLowerCase()}`);

amqp.connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    throw error0;
  }

  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    let exchange = "routing_order";

    channel.assertExchange(exchange, "direct", {
      durable: false,
    });

    queues.map((queue, index) => {
      channel.assertQueue(queue, { exclusive: false }, function (error2, q) {
        if (error2) {
          throw error2;
        }
        let type = args[index];
        channel.bindQueue(q.queue, exchange, type);

        channel.consume(
          q.queue,
          function (msg) {
            console.log(
              " [x] %s: '%s'",
              msg.fields.routingKey,
              msg.content.toString()
            );
          },
          {
            noAck: true,
          }
        );
      });
    });
    // channel.assertQueue(
    //   "",
    //   {
    //     exclusive: true,
    //   },
    //   function (error2, q) {
    //     if (error2) {
    //       throw error2;
    //     }
    //     console.log(" [*] Waiting for logs. To exit press CTRL+C");

    //     args.forEach(function (type) {
    //       console.log(`Bind with ${type}`);
    //       channel.bindQueue(q.queue, exchange, type);
    //     });

    //     channel.consume(
    //       q.queue,
    //       function (msg) {
    //         console.log(
    //           " [x] %s: '%s'",
    //           msg.fields.routingKey,
    //           msg.content.toString()
    //         );
    //       },
    //       {
    //         noAck: true,
    //       }
    //     );
    //   }
    // );
  });
});
