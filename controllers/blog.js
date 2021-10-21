const notesRouter = require('express').Router();
const Blog = require('../models/blog.js');

// Huom: Koska määritellän router, joka saa index.js:ssä parametrinä /api/notes, niin ei tarvi kuin laittaa / tähän
notesRouter.get('/', (request, response) => {

    Blog.find({})
        .then(result => response.json(result));

});

notesRouter.post('/', (request, response) => {

    const blog = new Blog(request.body);

    blog.save()
        .then(result => response.status(201).json(result));
});

module.exports = notesRouter;