const webtoken = require('jsonwebtoken');
const crypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user.js');

loginRouter.post('/', async (request, response) => {


    const body = request.body;

    const user = await User.findOne({username:body.username});

    const passwordCorrect = user === null
        ? false
        : await crypt.compare(body.password, user.passwordHash);

    if(!user ||!passwordCorrect)
    {
        response.status(401).json({error: 'invalid username or password'});
    }

    const loginToken = {
        username: user.username,
        id: user._id
    };

    const token = webtoken.sign(loginToken,
        process.env.SECRET,
        {expiresIn: 60*60});

    response
    .status(200)
    .send({ token, username: user.username, name:user.name});
});

module.exports = loginRouter;