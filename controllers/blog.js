const notesRouter = require('express').Router();
const Blog = require('../models/blog.js');

// Huom: Koska määritellän router, joka saa index.js:ssä parametrinä /api/notes, niin ei tarvi kuin laittaa / tähän


notesRouter.get('/', async (request, response) => {

    const result = await Blog.find({});

    if(result)
        response.json(result.map(r => r.toJSON()));
    else
        response.status(404).end();
    

});

notesRouter.post('/', (request, response) => {

    const blog = new Blog(request.body);

   if(blog.title === undefined || blog.url === undefined)
        return response.status(404).json({error:'TITLE OR URL UNDEFINED'});

    if(blog.likes === undefined || blog.likes < 0)
        blog.likes = 0;

    blog.save()
    .then(result => {
        response.status(201).json(result);
    });
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