
const rateLimit = require('express-rate-limit');



const limiter = rateLimit({
  windowMs:  10* 60 * 1000, // 15 minutes
  max: 5, // Max requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = limiter;