const express = require('express');
const usersRouter = express.Router();

const { authenticate, getUserByUsername, createUser, getAllUsers, updateUser, getUserById, createCart } = require('./models');
const jwt = require('jsonwebtoken');
const { SECRET } = process.env;
const { requireUser } = require('./utils')

usersRouter.use((req, res, next) => {
    console.log('> A request has been made to the /users endpoint');
    next();
})

//get only current user
usersRouter.get('/', requireUser, async (req, res, next) => {
    const {id: userId} = req.user;
    try {
        const user = await getUserById(userId);

        if (user) {
            res.send({success: true, user})
        } else {
            throw new Error('User could not located')
        }
    } catch (e) {
        console.error(error)
        const{ name, message } = error
        next({ name, message })
    }
})

usersRouter.get('/all', requireUser, async (req, res, next) => {
    const {admin} = req.user;
    try {
        if (admin) {
            const data = await getAllUsers();
            const users = data.map((user) => {
                delete user.password;
                return user;
            })
            res.send({ users })
        } else {
            res.send({success: false, message: 'restricted'})
        }
    } catch (e) {
        console.error(error)
        const{ name, message } = error
        next({ name, message })
    }
})

usersRouter.post('/register', async (req, res, next) => {
    const { 
        username, 
        password, 
        firstName, 
        lastName, 
        email,
        address,
        admin 
    } = req.body;
    console.log(`> UN: ${username}`);

    try {
        if (password.length < 8) {
            throw new Error(`Password must be at least 8 characters`)
        } else if (username.length < 5) {
            throw new Error(`Username must be at least 5 characters`)
        }

        const requiredParams = {            
            username, 
            password, 
            firstName, 
            lastName, 
            email,
            address 
        };
        for (const [key, value] of Object.entries(requiredParams)) {
            if (!value) {
                throw new Error(`Missing data at position '${key}'`)
            }
        }

        const _user = await getUserByUsername({username});
        console.log(_user)

        if (_user) {
            // If a user by that username already exists, the request is redirected to the /login route where it will attempt to authenticate the user with the parameters provided
            console.log(`User already exists. Logging in instead`)
            return res.redirect(308, './login');
        } else {
            await createUser({
                username,
                password,
                firstName, 
                lastName, 
                email,
                address,
                admin 
            });
            
            //Once the new user is created, forward the request ./login to improve UX flow
            console.log(`User successfully created. Logging in.`)
            return res.redirect(308, './login');
        }
    } catch (e) {
        next(e);
    }
});

usersRouter.post('/login', async (req, res, next) => {
    const {username, password} = req.body;
    
    try {
        const requiredParams = {username, password};

        for (const [key, value] of Object.entries(requiredParams)) {
            if (!value) {
                throw new Error(`Please profide a valid ${key}`);
            }
        };

        const user = await authenticate({username, password});
        console.log(`>>> User: `, user)
        const { id, username: un } = user;
        delete user.password;

        if (user) {
            const token = jwt.sign({id, un}, SECRET, {expiresIn: '1w'});
            const newCart = await createCart({userId: user.id});
            res.send({ success: true, message: "you're logged in!", token, user});
        } else {
            console.log('user could not be logged in')
            throw new Error('User could not be authenticated')
        }
    } catch(error) {
        console.log(error);
        next(error);
    }
});

// Update non-read-only user informaiton:
usersRouter.patch('/update', requireUser, async (req, res, next) => {
    const user = req.user;

    // This block of code returns an array of only the object entries with !null values
    const filteredObj = {}
    Object.keys(req.body).forEach((key) => {
            if (req.body[key]) {
                filteredObj[key] = req.body[key];
            }
    })

    try {
        const { id } = user;
        const updatedUser = await updateUser(id, fields = filteredObj);
        console.log(updatedUser)
        return res.send({success: true, message: "User updated", user: updatedUser});
        
    } catch (e) {
        next(e);
    }
})

module.exports = usersRouter;