const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app.js');

const api = supertest(app);
const database_helper = require('./database_helper.js');
const Blog = require('../models/blog.js');

beforeEach(async () => {
	await Blog.deleteMany({});
	await Blog.insertMany(database_helper.dummyBlogs);
});

test('Does HTTP GET ALL return the correct amount of posts?', async () => {

	const result = await api.get('/api/blogs/');

	expect(result.body).toHaveLength(database_helper.dummyBlogs.length);

});

afterAll( () => mongoose.connection.close());