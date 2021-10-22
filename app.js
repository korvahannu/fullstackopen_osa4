const express = require('express');                     // Importataan express express-muuttujaan
const mongoose = require('mongoose');                   // Otetaan käyttöön mongoose, jolla hallitaan tietokantaa
const app = express();                                  // Otetaan käyttöön varsinainen express -kehys
const cors = require('cors');                           // Otetaan käyttöön cors

const logger = require('./utils/logger.js');            // Käytetään console.login sijaan
const config = require('./utils/config.js');            // Sisältää erilaisia asetuksia
const notesRouter = require('./controllers/blog.js');   // Router, joka ohjaa pyyntöjä

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
app.use('/api/blogs', notesRouter);                     // MIDDLEWARE, joka käsittelee GET, POST, DELETE, PUT ym. pyyntöjä.

module.exports = app;