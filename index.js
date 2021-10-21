const express = require('express');                     // Importataan express express-muuttujaan
const app = express();                                  // Otetaan käyttöön varsinainen express -kehys
const cors = require('cors');                           // Otetaan käyttöön cors

const logger = require('./utils/logger.js');            // Käytetään console.login sijaan
const config = require('./utils/config.js');            // Sisältää erilaisia asetuksia
const notesRouter = require('./controllers/blog.js');   // Router, joka ohjaa pyyntöjä

app.use(cors());                                        // MIDDLEWARE, sallii different origin pointin
app.use(express.json());                                // MIDDLEWARE, parsii tulevaa tietoa helpompilukuiseksi
app.use('/api/blogs', notesRouter);                     // MIDDLEWARE, joka käsittelee GET, POST, DELETE, PUT ym. pyyntöjä.

// Kuunellaan porttia (kts models/config.js)
app.listen(config.PORT, () => logger.info(`Server running on port ${config.PORT}`));