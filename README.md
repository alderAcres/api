
# API

Description..

A live version of the app can be found at ...

## Set up

Complete the following steps to set-up the API:

1.
2.
3.

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Project Structure

### MVC Structure
This opinionated workflow

#### Controllers
Controllers contain the logic of the app and is where the user requests will intially interact with. Users will only interact with the controllers only, that is their point of contact from the browser.

#### Services
Services are responsible for implementing and enforcing business rules. Services should be usable by both controllers and sockets and potentally other services.

#### Models
Models deal with any interaction with the database.



```bash
 ├── config.js
 └── errorHandler.js
    └── src
        ├── http
        │   ├── index.js
        │   ├── middleware.js
        │   └── server.js
        ├── controllers
        │   ├──
        │   ├──
        ├── models
        │   ├── index.js
        │   ├── client.js
        │   ├── sync.js
        │   └── users.js
        ├── routes
        │   └── index.html
        │   ├── users.js
        │   └── utils.js
        └── services
            └── index.js
```

Top level `index.js` is your Express Server. This should be responsible for setting up your API, starting your server, and connecting to your database.

Inside `/db` you have `index.js` which is responsible for creating all of your database connection functions, and `init_db.js` which should be run when you need to rebuild your tables and seed data.

Inside `/routes` you have `index.js` which is responsible for building the `apiRouter`, which is attached in the express server. This will build all routes that your React application will use to send/receive data via JSON.

Lastly `/public` and `/src` are the two puzzle pieces for your React front-end. `/public` contains any static files necessary for your front-end. This can include images, a favicon, and most importantly the `index.html` that is the root of your React application.

## Deploying

When you are ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.

## API Documentation

- BASE URL for all endpoints: [http://localhost:8080/api](http://localhost:8080/api) or deployed server URL.

### Routes

- Route 1: `GET /recipes`
- Route 2: `POST /recipes` (*Must be logged in*)
-
