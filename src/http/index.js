const chalk = require('chalk');
const app = require('./server');
const { composeMiddleware, standardMiddleware } = require('./middleware');
const apiRouter = require('../routes/index');

// Hooks in all of our standard middleware.
composeMiddleware(app, standardMiddleware);

// Hooks in a router for the /api route.
app.use('/api', apiRouter);

const startServer = (port, prod = false) => {
    console.log(
      `Application is running in ${prod ? 'production' : 'development'} mode.`
    );
  
    return new Promise((res) => {
      app.listen(port, () => {
        console.log(chalk.green(`Application is now listening on PORT:${port}`));
        res();
      });
    });
  };
  
  module.exports = startServer;