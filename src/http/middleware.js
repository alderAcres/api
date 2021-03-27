const express = require('express');

// A way to pass in a parameter in a .env file.
const whiteListedUrl = process.env.WHITELISTED_URL || '*';

// Allow CORS - let client applications not served from the same port communicate with us 
// note: instead of installing cors package
const customCORSMiddleware = (req, res, next) => {
    res.set('Access-Control-Allow-Origin', whiteListedUrl);
    res.set(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.set('Vary', 'Origin');
  
    next();
};

// TODO: You could add any middleware into here.
// Combine all the middleware in an array.
const standardMiddleware = [
    express.json(), // express built-in body parser
    express.urlencoded({ extended: true }), // express built-in body parser
    customCORSMiddleware
];

// Put them all together into a single function.
const composeMiddleware = (app, middleware) => {
  middleware.forEach((m) => {
    app.use(m);
  });
};

module.exports = { composeMiddleware, standardMiddleware };