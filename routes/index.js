const express = require('express');

const speakersRoute = require('./speakers.js');
const feedbackRoute = require('./feedback.js');

const router = express.Router();

module.exports = (params) => {
  const { speakersService } = params;

  router.get('/', async (request, response, next) => {
    try {
      const topSpeakers = await speakersService.getList();
      const artworks = await speakersService.getAllArtwork();
      return response.render('layout', {
        pageTitle: 'Welcome',
        template: 'index',
        topSpeakers,
        artworks,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.use('/speakers', speakersRoute(params));
  router.use('/feedback', feedbackRoute(params));

  return router;
};
