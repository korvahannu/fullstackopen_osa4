const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app.js');

const api = supertest(app);
const database_helper = require('./database_helper.js');
const Blog = require('../models/blog.js');
const User = require('../models/user.js');
const cryptor = require('bcrypt');

/*
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
	.expect(404);

	await api.post('/api/blogs')
	.send(newBlog2)
	.expect(404);
});

test('Does deleting a post work?', async () => {

	const startNotes = await database_helper.getBlogFromDatabase();
	const noteToDelete = startNotes[0];

	await api.delete(`/api/blogs/${noteToDelete.id}`)
	.expect(204);

	const endNotes = await database_helper.getBlogFromDatabase();

	expect(endNotes).toHaveLength(startNotes.length-1);

	const titles = endNotes.map(r => r.title);

	expect(titles).not.toContainEqual(noteToDelete.title);
});


test('Does post updating (HTTP PUT) work?', async () => {

	const newBlog = {
		title: 'PUT_TEST_1',
		author: 'Hannu Korvala',
		url: 'TEST_URL',
		likes: 10
	};

	const result = await api.post('/api/blogs')
	.send(newBlog)
	.expect(201)
	.expect('Content-Type', /application\/json/);

	const updateNoteTo = {
		title: '2_PUT_TEST',
		author: '2_Hannu Korvala',
		url: '2_TEST_URL',
		likes: 22
	};

	const updateResult = await api.put(`/api/blogs/${result.body.id}`)
	.send(updateNoteTo)
	.expect(201)
	.expect('Content-Type', /application\/json/);

	const blog = await database_helper.getBlogFromDatabase();
	
	expect(blog).toContainEqual(updateResult.body);
});
*/

describe('User database tests', () => {

	beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await cryptor.hash('salaisuus', 10);
        const user = new User({username:'root', passwordHash});

        await user.save();
    });

	test('creation succeeds with a fresh username', async () => {

        const usersAtStart = await database_helper.getUsersFromDatabase();

        const newUser = {
            username:'hkorvala',
            name:'Hannu Korvala',
            password:'kukka'
        };

        await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await database_helper.getUsersFromDatabase();
        expect(usersAtEnd).toHaveLength(usersAtStart.length+1);

        const usernames = usersAtEnd.map(r => r.username);

        expect(usernames).toContain(newUser.username);

    });

	test('creating fails with proper statuscode and message if username already taken', async () => {

		const usersAtStart = await database_helper.getUsersFromDatabase();

		const newUser = {
			username: 'root',
			name: 'superuser',
			password: 'salainen'
		};

		const result = await api
		.post('/api/users')
		.send(newUser)
		.expect(400)
		.expect('Content-Type', /application\/json/);

		expect(result.body.error).toContain('`username` to be unique');

		const usersAtEnd = await database_helper.getUsersFromDatabase();

		expect(usersAtEnd).toHaveLength(usersAtStart.length);
	});

	test('creating fails with proper statuscode and message if username or password missing or too short', async () => {

		const usersAtStart = await database_helper.getUsersFromDatabase();

		const newUser = {
			name: 'superuser',
			password: 'salainen'
		};

		const result = await api
		.post('/api/users')
		.send(newUser)
		.expect(400)
		.expect('Content-Type', /application\/json/);

		expect(result.body.error).toContain('username or password undefined');

		const newUser2 = {
			username: 'h',
			name: 'superuser',
			password: 'salainen'
		};

		const newResult = await api
		.post('/api/users')
		.send(newUser2)
		.expect(400)
		.expect('Content-Type', /application\/json/);

		expect(newResult.body.error).toContain('username or password too short');

		const usersAtEnd = await database_helper.getUsersFromDatabase();

		expect(usersAtEnd).toHaveLength(usersAtStart.length);
	});

});


afterAll( () => mongoose.connection.close());