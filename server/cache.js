const { promisify } = require('util');

const redis = require("redis"),
    client = redis.createClient({
        host: process.env.NODE_ENV === "development" ? '0.0.0.0' : 'redis'
    });
client.on("error", function (err) {
    console.log("Error " + err);
});
module.exports.set = promisify(client.hset).bind(client);
module.exports.get = promisify(client.hget).bind(client);

// module.exports.get = () => {
//     return new Promise((resolve, reject) => {
//         resolve(null)
//     })
// }
