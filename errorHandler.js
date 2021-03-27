const { PROD } = require('./config');

const errorHandler = (error, req, res, next) => {
    let response;
    if(PROD === 'production') {
        response = { error: { message: 'server error' }};
    } else {
        console.error(error);
        response = { message: error.message, error }
    }
    res.status(500).json(response);
}

module.exports = errorHandler;