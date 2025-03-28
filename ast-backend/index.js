const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const { sendMessageToCloudflare } = require('./cloudflare');
const { getUsers } = require('./utils/users');
const authRouter = require('./routes/auth');
const sendMessageRouter = require('./routes/send-message');

const app = express();
app.use(bodyParser.json());
app.use(passport.initialize());

// --- Global Rate Limit ---
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// --- JWT Strategy ---
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwt_payload, done) => {
      try {
        const users = await getUsers();
        const user = users.find((u) => u.id === jwt_payload.id);
        if (user) return done(null, user);
        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

app.use(authRouter);
app.use(sendMessageRouter);

// --- Start Server ---
app.listen(process.env.PORT, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
);
