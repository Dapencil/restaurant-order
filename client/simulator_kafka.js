const kafka = require("kafka-node");
const client = new kafka.KafkaClient({ kafkaHost: "localhost:9093" });

const options = {
  partitionerType: 2,
};

const items = [
  { id: "1", name: "Pad Thai", type: "Thai" },
  { id: "2", name: "Hawaiian Pizza", type: "Italian" },
  { id: "3", name: "Miso Soup", type: "Japanese" },
  { id: "4", name: "Mala", type: "Chinese" },
  { id: "5", name: "Mataba", type: "Indian" },
];

const limitMinute = 2;
const orderPerSec = parseInt(250000 / 60);
let count = limitMinute * 60;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const Producer = kafka.Producer;
const producer = new Producer(client, options);

producer.on("ready", function () {
  console.log("Producer is ready");
  client.refreshMetadata(["order-thai"], function (err, data) {
    let simulator = setInterval(() => {
      if (count == 0) {
        clearInterval(simulator);
        console.log("Finished Simulate");
        process.exit(0);
      } else {
        for (let i = 0; i < orderPerSec; i++) {
          let orderItem = items[getRandomInt(items.length)];
          send(orderItem);
        }
        count--;
      }
    }, 1000);
  });
});

function send(item) {
  payloads = [
    { topic: `order-${item.type.toLowerCase()}`, messages: item.name },
  ];
  producer.send(payloads, function (err, data) {
    console.log("send data ", item);
  });
}
