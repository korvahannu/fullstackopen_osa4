
const mongoose = require('mongoose');
const logger = require('../utils/logger.js');
const config = require('../utils/config.js');

logger.info('Connecting to MongoDB. . .');
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('Connected to MongoDB!');
    })
    .catch(() => {
        logger.info('Connection to MongoDB failed!');
    });

const blogSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
});

module.exports = mongoose.model('Blog', blogSchema);