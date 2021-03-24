const { Router } = require('express');

const apiRouter = Router();

// Function to verify tokens when a request is made to the API:
const { getUserById } = require('../db');
const jwt = require('jsonwebtoken')
const { SECRET } = process.env;

apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');
  
  if (!auth) {
      next();
  } else if (auth.startsWith(prefix)) {
      const token = auth.slice(prefix.length);

      try {
          const {id} = jwt.verify(token, SECRET);

          if (id) {
              req.user = await getUserById(id);
              console.log(`req.user: `, req.user)
              next();
          }
      } catch (error) {
          error.status = 400;
          error.message = "Invalid token"
          next(error);
      }
  } else {
      next({
          name: 'AuthorizationHeaderError',
          message: `Authorization token must start with ${ prefix }`
      });
  };
});

const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);


// An example route that the client requests to check if the app is healthy.
apiRouter.get('/health', (req, res) => {
    res.send({
      message: 'Application is awake and healthy',
    });
});

module.exports = apiRouter;