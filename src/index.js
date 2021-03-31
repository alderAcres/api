const express = require ('express');
const bodyParser = require('body-parser');
const { getToken, getDogData, getDogDataSort, receiveUserData } = require('./middleware');
const db = require('./db/queries')
const PORT = process.env.PORT || 3001;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json())

app.post('/signup', receiveUserData, db.createUser, db.storeUserPreferences)
app.get('/users', db.getUsers)
app.post('/login', db.getLogin)
app.get('/users/:id', db.getUserById)
app.get('/users', db.getUsers)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

app.get('/api', getToken, getDogData, (req, res) => {
   res.status(200).send(res.locals.dogData.slice(0,100))
})

app.post('/api', getToken, getDogDataSort, getDogData, (req, res) => {
   res.status(200).send(res.locals.pref)
})


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