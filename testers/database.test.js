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
	// Jos joku id on määritelty, palautetaan true, halutaan false
	expect(result.body.some(r => r._id !== undefined)).toBe(false);
	// Jos joku _id ei ole määritetty, palautetaan true, halutaan false
	expect(result.body.some(r => r.id === undefined)).toBe(false);
});

test('Does HTTP POST function properly?', async () => {

	const newBlog = {title:'testi', author:'testi11221133', url:'testi', likes:50};

	await api.post('/api/blogs/')
	.send(newBlog)
	.expect(201)
	.expect('Content-Type', /application\/json/);

	const response = await api.get('/api/blogs');
	const response_author= response.body.map(r => r.author);

	expect(response.body).toHaveLength(database_helper.dummyBlogs.length+1);
	expect(response_author)
	.toContainEqual('testi11221133');

});

test('Does backend prevent from having likes as undefined?', async () => {
	const newBlog = {title:'test', author:'test', url:'test'};

	await api.post('/api/blogs/')
	.send(newBlog)
	.expect(201)
	.expect('Content-Type', /application\/json/);

	const response = await api.get('/api/blogs');
	const responseLikes = response.body.map(r => r.likes);

	expect(responseLikes.some(r => r === undefined)).toBe(false);
});

test('Does backend return 404 if post title or url is undefined?', async () => {
	const newBlog = {title:'test', author:'test', likes:1};
	const newBlog2 = {author:'test', url:'test', likes:1};

	await api.post('/api/blogs')
	.send(newBlog)
	.expect(404)
	.expect('Content-Type', /application\/json/);

	await api.post('/api/blogs')
	.send(newBlog2)
	.expect(404)
	.expect('Content-Type', /application\/json/);
});

afterAll( () => mongoose.connection.close());