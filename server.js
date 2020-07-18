const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const createError = require('http-errors');

const FeedbackService = require('./services/FeedbackService');
const SpeakersService = require('./services/SpeakerService');

const feedbackService = new FeedbackService('./data/feedback.json');
const speakersService = new SpeakersService('./data/speakers.json');

const routes = require('./routes');

const app = express();

const port = 3000;

app.set('trust proxy', 1); // Make Express trust cookies that are passed through a reverse proxy

app.use(
  cookieSession({
    name: 'session',
    keys: ['sdfgsdfgsdfgsdfgsdfgsdfgsdfgsdfgsdfg', 'dbhisdfgbhjsdf'],
  })
);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.locals.siteName = 'ROUX Meetups Web';

app.use(express.static(path.join(__dirname, 'static')));

app.use(async (request, response, next) => {
  try {
    const names = await speakersService.getNames();
    response.locals.speakerNames = names;
    return next();
  } catch (err) {
    return next(err);
  }
});

app.use(
  '/',
  routes({
    feedbackService,
    speakersService,
  })
);

// No routes before matched therefore 404 not found
app.use((request, response, next) => {
  return next(createError(404, 'File Not Found'));
});

// Create error handler to render 404 page
app.use((err, request, response, next) => {
  response.locals.message = err.message;
  console.error(err);
  const status = err.status || 500;
  response.locals.status = status;
  response.status(status);
  response.render('error');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
