const amqp = require("amqplib/callback_api");
const limitMinute = 2;
const orderPerSec = parseInt(200000 / 60);
let count = limitMinute * 60;

const items = [
  { id: "1", name: "Pad Thai", type: "Thai" },
  { id: "2", name: "Hawaiian Pizza", type: "Italian" },
  { id: "3", name: "Miso Soup", type: "Japanese" },
  { id: "4", name: "Mala", type: "Chinese" },
  { id: "5", name: "Mataba", type: "Indian" },
];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

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

    let simulator = setInterval(() => {
      if (count == 0) {
        clearInterval(simulator);
        console.log("Finished Simulate");
        process.exit(0);
      } else {
        for (let i = 0; i < orderPerSec; i++) {
          let orderItem = items[getRandomInt(items.length)];
          channel.publish(
            exchange,
            orderItem.type,
            Buffer.from(JSON.stringify(orderItem)),
            {
              persistent: true,
            }
          );
        }
        count--;
        console.log(`Remain round ${count}`);
      }
    }, 1000);
  });
});
