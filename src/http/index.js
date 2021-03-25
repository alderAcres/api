const chalk = require('chalk');
const app = require('./server');
// const { composeMiddleware, standardMiddleware } = require('./middleware');
// const apiRouter = require('../routes/index');
const axios = require('axios');

// Hooks in all of our standard middleware.
// composeMiddleware(app, standardMiddleware);

// Hooks in a router for the /api route.
// app.use('/api', apiRouter);


// Client credentials
// Replace these with your key/secret
var key = 'apyx0Ol9KonQvo8YJp5ZetIUv5IEgX1xtKtsAQ1sfcCYy9YH9w';
var secret = 'FY7ntewUL1pRq9Qd0DxAHIXGSyZ8yHcxNMcrKwH1';

// Call details
var org = 'RI77';
var status = 'adoptable';

// Call the API
// This is a POST request, because we need the API to generate a new token for us
//curl -H "Authorization: Bearer {YOUR_ACCESS_TOKEN}" GET https://api.petfinder.com/v2/{CATEGORY}/{ACTION}?{parameter_1}={value_1}&{parameter_2}={value_2}

app.get('/api', async (req, res) => {

 axios.post('https://api.petfinder.com/v2/oauth2/token', 'grant_type=client_credentials&client_id=' + key + '&client_secret=' + secret)
 .then(response => {
   return response.data;
  })
 .then(data => {
  return axios({
    url: 'https://api.petfinder.com/v2/animals?organization=' + org + '&status=' + status,
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + data.access_token,
      'Content-Type': 'application/x-www-form-urlencoded'
  }
  })
  .catch(err => console.log(err))
 })
//  .then(response => console.log('RES', response))
 .then(petData => {
   console.log('petDATA', petData.data)
 })
 .catch(err => res.send(err))
})

  
//Use to get access token:
//curl -d "grant_type=client_credentials&client_id=apyx0Ol9KonQvo8YJp5ZetIUv5IEgX1xtKtsAQ1sfcCYy9YH9w&client_secret=FY7ntewUL1pRq9Qd0DxAHIXGSyZ8yHcxNMcrKwH1" https://api.petfinder.com/v2/oauth2/token



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

