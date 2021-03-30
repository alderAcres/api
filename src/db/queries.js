const Pool = require('pg').Pool;
const bcrypt = require('bcryptjs');

const conString = "postgres://gekdbamy:bGsx_AIPrccGvowhA5gB4sHDJxTR9iHZ@queenie.db.elephantsql.com:5432/gekdbamy" //our DB url
const SALT_WORK_FACTOR = 10;

const pool = new Pool({
  connectionString: conString,
  max: 5
});

pool.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  pool.query('SELECT * FROM users', function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0]);
  });
});

//GET ALL USERS
const getUsers = (request, response) => {
  pool.query('SELECT * FROM users', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

//GET USER BY ID
const getUserById = (request, response) => {
  const id = parseInt(request.params.id)
  pool.query('SELECT * FROM users WHERE user_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

//Create new user
const createUser = (request, response) => {
  const { email, password } = request.body
  const cryptPw = bcrypt.hashSync(password, SALT_WORK_FACTOR)
  
  pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING user_id', [email, cryptPw], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User added with ID: ${results.rows[0].user_id}`)
  })
}

//Update User Info
const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { email, password } = request.body

  pool.query(
    'UPDATE users SET email = $1, password = $2 WHERE user_id = $3',
    [email, password, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

//Delete a User
const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE user_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}