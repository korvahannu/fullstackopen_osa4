const notesRouter = require('express').Router();
const Blog = require('../models/blog.js');
const User = require('../models/user.js');
const webtoken = require('jsonwebtoken');

// Huom: Koska määritellän router, joka saa index.js:ssä parametrinä /api/notes, niin ei tarvi kuin laittaa / tähän

const getTokenFrom = request => {

    const authorization = request.get('authorization');

    if(!authorization)
        return null;

    if(authorization.toLowerCase().startsWith('bearer '))
    {
        return authorization.substring(7);
    }


    return null;

};

notesRouter.get('/', async (request, response) => {

    const result = await Blog.find({})
    .populate('user', {username: 1, name: 1});

    if(result)
    {
        response.json(result.map(r => r.toJSON()));
    }
    else
        response.status(404).end();
    

});

notesRouter.post('/', async (request, response) => {

    const body = request.body;

    const token = request.token;

    const decodedToken = webtoken.verify(token, process.env.SECRET);

    if(!token ||!decodedToken)
    {
        return response.status(401).json({error: 'missing or invalid token'});
    }

    const user = await User.findById(decodedToken.id);

    if(body.title === undefined || body.url === undefined)
        return response.status(404).json({error:'TITLE OR URL UNDEFINED'});

    if(body.likes === undefined || body.likes < 0)
        body.likes = 0;

    const newBlog = new Blog({

        title:body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id

    });

    const savedBlog = await newBlog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    
    user.markModified('added a blog to user');
    //await user.save();

    /*
    Kauankohan yritin saada user.save() toimimaan? ei toimi millään. ja miksi? ei mitään hajua. findByIdAndUpdate toimii oikein hyvin
    */

    await User.findByIdAndUpdate(user._id, user, {new: true});

    response.json(savedBlog.toJSON());
});


notesRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id);

    response.status(204).end();
});

notesRouter.put('/:id', async (request, response) => {
    const body = request.body;
    let updatedBlog = [];

    if(body.title !== undefined)
        updatedBlog.title = body.title;
    if(body.author !== undefined)
        updatedBlog.author = body.title;
    if(body.url !== undefined)
        updatedBlog.url = body.title;
    if(body.likes !== undefined)
        updatedBlog.likes = body.title;

    const result = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {new: true});

    response.status(201).json(result);
});

module.exports = notesRouter;
