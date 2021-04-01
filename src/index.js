const express = require ('express');
const bodyParser = require('body-parser');
const { getToken, getDogData, getDogDataSort, receiveUserData } = require('./middleware');
const db = require('./db/queries')
const PORT = process.env.PORT || 3001;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

//This route is accessed after a user has gone through signup (creating preferences) and logged in.
//It display all the dogs that have been filtered out according to user's preferences on the home page
app.get('/api/:id', db.accessPreferences, getToken, getDogData, (req, res) => {
    res.status(200).send(res.locals.dogData)
})
// app.get('/api', getToken, getDogData, (req, res) => {
//     res.status(200).send(res.locals.dogData.slice(0,100))
//  })

app.post('/login', db.getLogin)
app.post('/signup', receiveUserData, db.createUser, db.storeUserPreferences)

//manipulate or access user data
app.get('/users/:id', db.getUserById)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)
app.get('/users', db.getUsers)


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