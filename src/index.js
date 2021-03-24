const chalk = require('chalk');
const { PORT, PROD } = require('../config');
const startServer = require('./http/index');

startServer(PORT, PROD).then(() => {
   console.log(chalk.cyan(`Application started.`));
});