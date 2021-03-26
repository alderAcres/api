const chalk = require('chalk');
const app = require('./server');
// const { composeMiddleware, standardMiddleware } = require('./middleware');
// const apiRouter = require('../routes/index');
const axios = require('axios');

// Client credentials
const key = 'apyx0Ol9KonQvo8YJp5ZetIUv5IEgX1xtKtsAQ1sfcCYy9YH9w';
const secret = 'FY7ntewUL1pRq9Qd0DxAHIXGSyZ8yHcxNMcrKwH1';

// Call details
const org = 'RI77';
const status = 'adoptable';

//First sending a post request to our petfinder api with our client credentials to access our token 
//Secondly, using our token in the header of a get request to access petfinder dog data
app.get('/api', (req, res) => {

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
 .then(petData => {
   let dogArr = [];
   for(let i = 0; i < petData.data.animals.length; i++) {
     if(petData.data.animals[i].species === 'Dog') dogArr.push({
       ...petData.data.animals[i],
       location: petData.data.animals[i].contact.address.postcode 
     })
   }
   res.status(200).send(dogArr)
 })
 .catch(err => res.status(400).send(err))
})


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

