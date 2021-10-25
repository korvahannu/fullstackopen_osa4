const notesRouter = require('express').Router();
const Blog = require('../models/blog.js');
const User = require('../models/user.js');

// Huom: Koska määritellän router, joka saa index.js:ssä parametrinä /api/notes, niin ei tarvi kuin laittaa / tähän


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

    const user = await User.findById(body.userId);

    if(body.title === undefined || body.url === undefined)
        return response.status(404).json({error:'TITLE OR URL UNDEFINED'});

    if(body.likes === undefined || body.likes < 0)
        body.likes = 0;

    const blog = new Blog({

        title:body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id

    });

    const result = await blog.save();

    user.blogs = user.blogs.concat(result._id);
    
    //await user.save();    <- en saanut toimimaan tuolla
    await User.findByIdAndUpdate(user._id, user, {new: true});

    response.json(result.toJSON());
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