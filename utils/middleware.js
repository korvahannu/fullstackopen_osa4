const logger = require('./logger');

// Middlewaren käyttöönottojärjestyksellä on väliä, katso app.js

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

const unknownEndpoint = (request, response) => {          // Jos pyydetään osoitetta, jota ei ole olemassa niin mennään tänne

  response.status(404).send({ error: 'unknown endpoint' });

};

const errorHandler = (error, request, response, next) => {

  logger.error(error.message);

  if (error.name === 'CastError') {

    return response.status(400).send({ error: 'malformatted id' });

  }
  else if (error.name === 'ValidationError')
  {
    return response.status(400).json({ error: error.message });
  }

  next(error);  // Palauttaa järjestelmän omalle virheenkäsittelijälle
};

module.exports = { requestLogger, unknownEndpoint, errorHandler };