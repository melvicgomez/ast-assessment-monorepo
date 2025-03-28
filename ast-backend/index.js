const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
require('dotenv').config();

const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const { getUsers } = require('./utils/users');
const authRouter = require('./routes/auth');
const sendMessageRouter = require('./routes/send-message');

const app = express();

// Body Parser
app.use(express.json());

// Passport
app.use(passport.initialize());

// CORS
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// JWT Strategy
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

// Routers
app.use(authRouter);
app.use(sendMessageRouter);

// Handle 401 Unauthorized errors returned by passport or others
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError' || err.status === 401) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next(err);
});

// Start server
app.listen(process.env.PORT, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
);
