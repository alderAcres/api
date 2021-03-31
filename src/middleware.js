const axios = require('axios');

let key = 'apyx0Ol9KonQvo8YJp5ZetIUv5IEgX1xtKtsAQ1sfcCYy9YH9w';
let secret = 'FY7ntewUL1pRq9Qd0DxAHIXGSyZ8yHcxNMcrKwH1';
const org = 'RI77';
const status = 'adoptable';

//TODO
/*
1. destructure request body for individual variables rather than objects
2. if condiitonal asking all variables filter dog data
*/

function receiveUserData(req, res, next) {
  if(!req.body) {
    throw Error;
  }
console.log('receiveUserData hitting', req.body)
res.locals.pref = req.body.preferences
res.locals.userData = req.body.user
next()
}

function getDogDataSort(req, res, next){
  console.log(req.body)
  let prefObj = {}
  Object.assign(prefObj, req.body)

  res.locals.pref = prefObj;
  next();
}
async function getDogData(req, res, next){
    const preferences = res.locals.pref;  
    const data = res.locals.data;
    await axios({
        url: 'https://api.petfinder.com/v2/animals?limit=' + 100 + '&status=' + status,
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + data.access_token,
          'Content-Type': 'application/x-www-form-urlencoded'
      }
      })
      .then(petData => {
       let dogArr = [];
       for(let i = 0; i < petData.data.animals.length; i++) {
         if(petData.data.animals[i].species === 'Dog' && petData.data.animals[i].primary_photo_cropped) {
           if(res.locals.pref){
             if(checksAllPreferences(petData.data.animals[i], preferences)) {
               dogArr.push(petData.data.animals[i])
               console.log('THIS DOG FU', petData.data.animals[i])
             }
           } else {
          //  console.log('COMPARE', petData.data.animals[i].attributes == attr)
           dogArr.push({
           ...petData.data.animals[i],
           location: petData.data.animals[i].contact.address.postcode 
         })
        }
      }
       }
       console.log(dogArr.length)
       res.locals.dogData = dogArr;
       next()
      })
      .catch(err => next(err))
  }
  
  function checksAllPreferences(dog, userPreferences){
    console.log('COMPARE', dog.environment.children)
      if(dog.environment.children && userPreferences.children == dog.environment.children.toString()) return true;
      // dog.environment.cats && userPreferences.cats == dog.environment.cats.toString() &&
      // dog.attributes.spayed_neutered && userPreferences.spayed == dog.attributes.spayed_neutered.toString() &&
      // dog.attributes.house_trained && userPreferences.house_trained == dog.attributes.house_trained.toString() &&
      // dog.attributes.special_needs && userPreferences.special_needs == dog.attributes.special_needs.toString() &&
      // dog.attributes.shots_current && userPreferences.shots_current == dog.attributes.shots_current.toString()) return true;
        else return false;
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
      getDogData,
      getDogDataSort,
      receiveUserData
  }