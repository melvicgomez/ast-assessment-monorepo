const express = require('express');
const passport = require('passport');
const { sendMessageToCloudflare } = require('../cloudflare');

const router = express.Router();

router.post(
  '/send-message',
  passport.authenticate('jwt', { session: false, failWithError: true }),
  async (req, res) => {
    try {
      const { message } = req.body;
      const response = await sendMessageToCloudflare(
        process.env.CLOUDFLARE_WORKER_MODEL,
        { messages: message }
      );
      res.json(response);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Cloudflare API failed' });
    }
  }
);

module.exports = router;
