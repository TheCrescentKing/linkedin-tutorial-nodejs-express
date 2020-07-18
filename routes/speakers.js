const express = require('express');
const SpeakerService = require('../services/SpeakerService');

const router = express.Router();

module.exports = (params) => {
  const { speakersService } = params;

  router.get('/', async (request, response, next) => {
    try {
      const speakers = await speakersService.getList();
      const artworks = await speakersService.getAllArtwork();
      return response.render('layout', {
        pageTitle: 'Speakers',
        template: 'speakers',
        speakers,
        artworks,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.get('/:shortname', async (request, response, next) => {
    try {
      const speaker = await speakersService.getSpeaker(request.params.shortname);
      const artworks = await speakersService.getArtworkForSpeaker(request.params.shortname);
      return response.render('layout', {
        pageTitle: request.params.shortname,
        template: 'speakers-detail',
        speaker,
        artworks,
      });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
