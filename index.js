/*
Tässä tehdään serverin alustus. Varsinainen express-sovellus löytyy ./app
Testerit EIVÄT käytä tätä tiedostoa minkään alustamiseen.

Pseudokoodi:
    app = require(express sovellus)
    http = require(http)

    server = luo serveri http -objektista
    server => kuuntele porttia 3001 tai mikälie
*/

const app = require('./app');
const http = require('http');
const config = require('./utils/config.js');
const logger = require('./utils/logger.js');

const server = http.createServer(app);

// Kuunellaan porttia (kts utils/config.js)
server.listen(config.PORT, () => logger.info(`Server running on port ${config.PORT}`));