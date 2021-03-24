const client = require("./client");
const bcrypt = require('bcrypt');
const SALT_COUNT = process.env.SALT_COUNT || 10;

// take a string and return a hashed version
async function hashStr(str) {
  const hash = await bcrypt.hash(str, SALT_COUNT);
  return hash;
}

// create new user (public and admin) screen
const createUser = async ({
  username,
  password,
  firstName,
  lastName,
  email,
  address,
  admin = false

}) => {

   try {
      const pw = await hashStr(password)
      const { rows: [ users ] } = await client.query(`
          INSERT INTO users(username, password, "firstName", "lastName", email, address, admin)
          VALUES ($1,$2,$3,$4,$5,$6,$7)
          ON CONFLICT (username) DO NOTHING
          RETURNING *;
          `, [username, pw, firstName, lastName, email, address, admin]
      );

      return users;

   } catch(error){
      throw error; 
   }
}

const getAllUsers = async () => {

  try {
      const { rows } = await client.query(`
         SELECT *
         FROM users;
      `);
  
      return rows;
  
    } catch (error){
      throw error;
    }
}

const getUserById = async (userId) => {
   
  try {
      const { rows: [ user ] } = await client.query(`
      SElECT * 
      FROM users
      WHERE id= $1
      `, [userId]);
      
      if(!user) {
          const error = new Error('invalid username');
          error.status = 400;
          throw error;
      };

      return user;

    } catch(error){
      throw error;
  }
}

async function getUserByUsername ({username}) {
  try {
      const { rows: [user] } = await client.query(`
          SELECT * FROM users
          WHERE username=$1;
      `, [username]);

      return user;
  } catch (e) {
      console.log(`> failed to get user with username ${username}`)
      throw new Error(`failed to get user with username ${username}`);
  }
}

// used to authenticate a user by UN and PW using bcrypt - necessary for login process
const authenticate = async ({username, password}) => {
  try {
      const user = await getUserByUsername({username});
      if (!user) {
          const error = new Error('invalid username');
          error.status = 400;
          throw error;
      };
      const authenticated = await bcrypt.compare(password, user.password)
      if (!authenticated) {
          const error = new Error('invalid password');
          error.status = 400;
          throw error;
      };
      
      return user;
  } catch (e) {
      throw e;
  }    
}

const updateUser = async (id, fields = {} ) => {

  //Builds a setString based off the fields parameter
  const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');

    console.log('setstring', setString)
  
    if (setString.length === 0) {
      return;
    }
  
    try {
      const { rows: [ users ] }= await client.query(`
        UPDATE users
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(fields));
  
      return users;
    } catch (error) {
      throw error;
    }
}


module.exports = {
  createUser,
  getAllUsers,
  getUserByUsername,
  updateUser,
};