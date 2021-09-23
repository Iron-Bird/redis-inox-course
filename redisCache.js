const redis = require('redis');

const redisClient = redis.createClient();

module.exports = {
    setItemToRedis: (key, item) => {
        redisClient.setex(key, 3600, JSON.stringify(item));
    },

    deleteItemFromRedis: function (key, data) {
        redisClient.del(key, (err, data) => {
            if (data === 1) {
                console.log(`Data by the key ${key} was removed from redis`);
            }
        })
    },

    getOrSetItemFromRedis: function (key, cb) {
        return new Promise((resolve, reject) => {
            redisClient.get(key, async (err, data) => {
                if (err) {
                    return reject(err);
                }

                if (data) {
                    return resolve(JSON.parse(data))
                }

                let freshData = await cb();

                if (freshData) {
                    redisClient.setex(key, 3600, JSON.stringify(freshData));
                    resolve(freshData);
                }
            });
        });
    }
};
