const express = require ('express');
const bodyParser = require('body-parser');
const { getToken, getDogData, receiveUserData, displayUserFavs } = require('./middleware');
const cors = require('cors');
const db = require('./db/queries')
const PORT = process.env.PORT || 3001;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

app.use(cors())

//This route is accessed after a user has gone through signup (creating preferences) and logged in.
//It display all the dogs that have been filtered out according to user's preferences on the home page
app.get('/api/:id', db.accessPreferences, db.getPostedDogs, getToken, getDogData, (req, res) => {
    res.status(200).send(res.locals.dogData)
})

app.post('/login', receiveUserData, db.getLogin)
app.post('/signup', receiveUserData, db.createUser, db.storeUserPreferences, db.getLogin)
app.post('/addDog/:id', db.postDog)

//manipulate or access user data
app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)
app.post('/users/:user_id/dogs/:dog_id', db.addFavorite)
app.get('/userDogs/:id', db.getDogsById)
app.get('/userFavs/:id', getToken, db.getUserFavorites, displayUserFavs)


//just using this route to test posted dogs (temporary)
app.get('/getDogs', db.getPostedDogs)

//error handling
app.use((error, req, res, next) => {
    console.log( "app error:", error.message);
    res.status(error.status || 500).json({
      error: error.message,
     });
    next();
});

// check health of app: 
app.get('/health', (req, res, next)=>{
    res.send("server is active");
});

 app.listen(PORT, () => {
      console.log(`app is listening on port: ${PORT}`);
});