const { promisify } = require('util');

const redis = require("redis"),
    client = redis.createClient({
        host: 'redis'
    });
client.on("error", function (err) {
    console.log("Error " + err);
});
module.exports.set = promisify(client.hset).bind(client);
module.exports.get = promisify(client.hget).bind(client);

