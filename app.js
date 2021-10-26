const express = require('express');                     // Importataan express express-muuttujaan
const mongoose = require('mongoose');                   // Otetaan käyttöön mongoose, jolla hallitaan tietokantaa
const app = express();                                  // Otetaan käyttöön varsinainen express -kehys
require('express-async-errors');
const cors = require('cors');                           // Otetaan käyttöön cors
const logger = require('./utils/logger.js');            // Käytetään console.login sijaan
const config = require('./utils/config.js');            // Sisältää erilaisia asetuksia
const middleware = require('./utils/middleware');       // Sisältää erilaisia middlewareja, joita otetaan alla käyttöön
const blogsRouter = require('./controllers/blog.js');   // Router, joka ohjaa pyyntöjä 
const usersRouter = require('./controllers/user.js');   // Router, joka ohjaa pyyntöjä
const loginRouter = require('./controllers/login.js');

logger.info('Connecting to MongoDB. . .');
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('Connected to MongoDB!');
    })
    .catch(() => {
        logger.info('Connection to MongoDB failed!');
    });

app.use(cors());                                        // MIDDLEWARE, sallii different origin pointin
app.use(express.static('build'));						// MIDDLEWARE, ohjaa pyynnöt /build/
app.use(express.json());                                // MIDDLEWARE, parsii tulevaa tietoa helpompilukuiseksi

app.use(middleware.getTokenFrom);

app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);                     // MIDDLEWARE, joka käsittelee GET, POST, DELETE, PUT ym. pyyntöjä
app.use('/api/blogs', blogsRouter);                     // MIDDLEWARE, joka käsittelee GET, POST, DELETE, PUT ym. pyyntöjä.

app.use(middleware.unknownEndpoint);                    // MIDDLEWARE, joka käsittelee jos pyyntö on kohdistunut tuntemattomaan osoitteeseen
app.use(middleware.errorHandler);                       // MIDDLEWARE, joka käsittelee virheitä

module.exports = app;
