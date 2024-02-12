const Client = require("./Base/Client");
const client = new Client();
const config = require("./Config/Config.json");
client.start(config.token);