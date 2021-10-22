const notesRouter = require('express').Router();
const Blog = require('../models/blog.js');

// Huom: Koska määritellän router, joka saa index.js:ssä parametrinä /api/notes, niin ei tarvi kuin laittaa / tähän


notesRouter.get('/', async (request, response ) => {

    const result = await Blog.find({});

    if(result)
        response.json(result.map(r => r.toJSON()));
    else
        response.status(404).end();

});


notesRouter.post('/', (request, response) => {

    const blog = new Blog(request.body);

    blog.save()
        .then(result => response.status(201).json(result));
});

module.exports = notesRouter;