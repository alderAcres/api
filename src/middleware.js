const axios = require('axios');

let key = 'apyx0Ol9KonQvo8YJp5ZetIUv5IEgX1xtKtsAQ1sfcCYy9YH9w';
let secret = 'FY7ntewUL1pRq9Qd0DxAHIXGSyZ8yHcxNMcrKwH1';
const org = 'RI77';
const status = 'adoptable';

async function getDogData(req, res, next){

    const data = res.locals.data;
    await axios({
        url: 'https://api.petfinder.com/v2/animals?organization=' + org + '&status=' + status,
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + data.access_token,
          'Content-Type': 'application/x-www-form-urlencoded'
      }
      })
      .then(petData => {
        let dogArr = [];
       for(let i = 0; i < petData.data.animals.length; i++) {
         if(petData.data.animals[i].species === 'Dog') dogArr.push({
           ...petData.data.animals[i],
           location: petData.data.animals[i].contact.address.postcode 
         })
       }
       res.locals.dogData = dogArr;
       next()
      })
      .catch(err => next(err))
  }
  
  function getToken(req, res, next){

    axios.post('https://api.petfinder.com/v2/oauth2/token', 'grant_type=client_credentials&client_id=' + key + '&client_secret=' + secret)
   .then(response => {
     res.locals.data = response.data;
     next();
    })
    .catch(err => next(err))
  }

  module.exports = {
      getToken,
      getDogData
  }