const express = require ('express');
const PORT = process.env.PORT || 3001;

const { getToken, getDogData} = require('./middleware');

const app = express();
app.use(express.json());

app.get('/api', getToken, getDogData, (req, res) => {
    if(res.locals.dogData) res.status(200).send(res.locals.dogData.slice(0,100))
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