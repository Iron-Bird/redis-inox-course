const { Router } = require('express');
const cache = require('express-redis-cache')();

cache.on('connected', () => {
    console.log('REDIS CONNECTED');
});

cache.get((err, data) => {
    console.log(data)
});

cache.del('/user/store-endpoint', (err, deleted) => {
    console.log(deleted);
});

const User = require('./User');
const { setItemToRedis, deleteItemFromRedis, getOrSetItemFromRedis } = require('./redisCache')
const axios = require("axios");

const userRouter = Router();

userRouter.get('/store-endpoint', cache.route(3600), async (req, res) => {
    const { data } = await axios.get('https://jsonplaceholder.typicode.com/users');

    res.json(data)
});

userRouter.post('/', async (req, res) => {
    const { body } = req;
    const { name } = body;

    const createdUser = await User.create(body);
    setItemToRedis(`user/${name}`, body);

    res.json(createdUser)
});

userRouter.delete('/:name', async (req, res) => {
    const { name } = req.params;

    deleteItemFromRedis(`user/${name}`);

    const deletedUser = await User.deleteOne({ name });

    res.status(204).end();

});

userRouter.put('/:name', async (req, res) => {
    const { body, params: { name } } = req;

    const updatedUser = await User.findOneAndUpdate({ name }, { ...body }, { new: true });

    setItemToRedis(`user/${name}`, body);

    res.json(updatedUser);

});

userRouter.get('/:name', async (req, res) => {
    const { name } = req.params;

    const user = await getOrSetItemFromRedis(`user/${name}`, async () => {
        const userFromDb = await User.findOne({ name });

        if (!userFromDb) {
            res.json('No such user');
        }

        return userFromDb;
    });

    res.json(user);
})

module.exports = userRouter;