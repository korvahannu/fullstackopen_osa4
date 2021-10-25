const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user.js');

usersRouter.post('/', async (request, response) => {

    const body = request.body;

    if(body.password === undefined ||body.username === undefined)
    {
        return response.status(400).json({error:'username or password undefined'});
    }

    if(body.password.length < 3 || body.username.length < 3)
    {
        return response.status(400).json({error:'username or password too short'});
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,    // sama kuin passwordHash = passwordHash
    });

    const result = await user.save();

    response.json(result);
});

usersRouter.get('/', async (request, response) => {
    const users = await User
    .find({})
    .populate('blogs', {author:1, title:1, url:1,id:1});

    response.json(users.map(r => r.toJSON()));
    
});

module.exports = usersRouter;