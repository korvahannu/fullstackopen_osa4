const logger = require('./logger');

// Middlewaren käyttöönottojärjestyksellä on väliä, katso app.js

const getTokenFrom = (request, response, next) => {

  const authorization = request.get('authorization');

  if(authorization && authorization.toLowerCase().startsWith('bearer '))
  {
      request.token = authorization.substring(7);
  }

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
  else if (error.name === 'JsonWebTokenError')
  {
    return response.status(401).json({error: 'invalid token'});
  }
  else if (error.name === 'TokenExpiredError')
  {
    return response.status(401).json({error: 'token expired'});
  }

  next(error);  // Palauttaa järjestelmän omalle virheenkäsittelijälle
};

module.exports = { getTokenFrom, unknownEndpoint, errorHandler };