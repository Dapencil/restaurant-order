const amqp = require("amqplib/callback_api");
let args = process.argv.slice(2);

const items = [
  { id: "1", name: "Pad Thai", type: "Thai" },
  { id: "2", name: "Hawaiian Pizza", type: "Italian" },
  { id: "3", name: "Miso Soup", type: "Japanese" },
  { id: "4", name: "Mala", type: "Chinese" },
  { id: "5", name: "Mataba", type: "Indian" },
];

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

    let orderItem = items[parseInt(args[0])];
    console.log(orderItem);
    channel.publish(
      exchange,
      orderItem.type,
      Buffer.from(JSON.stringify(orderItem)),
      {
        persistent: true,
      }
    );
  });
});
