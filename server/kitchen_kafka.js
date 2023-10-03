const kafka = require("kafka-node");

const client = new kafka.KafkaClient({ kafkaHost: "localhost:9093" });
let args = process.argv.slice(2);

const topics = args.map((arg) => ({
  topic: `order-${arg.split("_")[0]}`,
  partition: parseInt(arg.split("_")[1]),
}));
console.log(topics);

client.on("ready", () => {
  console.log("Kafka Connected");
});

const options = {
  autoCommit: true,
};

const consumer = new kafka.Consumer(client, topics, options);

consumer.on("message", function (message) {
  console.log(message);
});
