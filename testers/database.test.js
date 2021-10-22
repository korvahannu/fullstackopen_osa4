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

test('Is returned object id-field called id instead of _id?', async () => {
	const result = await api.get('/api/blogs/');
	console.log(result.body.id);

	// Jos joku id on määritelty, palautetaan true, halutaan false
	expect(result.body.some(r => r._id !== undefined)).toBe(false);
	// Jos joku _id ei ole määritetty, palautetaan true, halutaan false
	expect(result.body.some(r => r.id === undefined)).toBe(false);
});

afterAll( () => mongoose.connection.close());