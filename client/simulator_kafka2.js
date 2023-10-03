const kafka = require("kafka-node");
const client = new kafka.KafkaClient({ kafkaHost: "localhost:9093" });
let args = process.argv.slice(2);

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
const Producer = kafka.Producer;
const producer = new Producer(client, options);

producer.on("ready", function () {
  console.log("Producer is ready");
  client.refreshMetadata(["order-thai"], function (err, data) {
    let orderItem = items[parseInt(args[0])];
    send(orderItem);
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
