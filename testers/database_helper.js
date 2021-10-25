const Blog = require('../models/blog.js');
const User = require('../models/user.js');

/*
    title: String,
    author: String,
    url: String,
    likes: Number
*/

const dummyBlogs = [
    {
        title: 'Uusi kirja tulossa ensivuonna',
        author: 'JK Rowlin',
        url: 'http://www.google.com/',
        likes: 5
    },
    {
        title: 'Paljastuksia . . .',
        author: 'JK Rowlin',
        url: 'http://www.google.com/',
        likes: 2
    },
    {
        title: 'Voiko valtioon enää luottaa?',
        author: 'J Karjalainen',
        url: 'http://www.google.com/',
        likes: 1
    },
    {
        title: 'Discomies',
        author: 'J Karjalainen',
        url: 'http://www.google.com/',
        likes: 6
    },
    {
        title: 'Onko musiikin maku hävinnyt suomesta?',
        author: 'J Karjalainen',
        url: 'http://www.google.com/',
        likes: 5
    },
    {
        title: 'Me at the zoo',
        author: 'Jawed Karim',
        url: 'http://www.google.com/',
        likes: 24
    }
];

const generateRandomID = async () => {

    const dummyPost = new Blog (dummyBlogs[0]);
    await dummyPost.save();
    await dummyPost.remove();
	
    const id = dummyPost._id.toString();

    return id;
};

const getBlogFromDatabase = async () => {

	const everything = await Blog.find({});

	return everything.map(r => r.toJSON());
};

const getUsersFromDatabase = async() => {
    const everything = await User.find({});

	return everything.map(r => r.toJSON());
};

module.exports = {dummyBlogs, generateRandomID, getBlogFromDatabase,  getUsersFromDatabase};