const asyncHandler = require('../utils/asyncHandler');
const db = require('../services/db')

//User method to get signed jwt and send back in cookie
const sendJwtResponse = (user, res) => {
    const jwt = user.getSignedJwt();
    res.cookie('auth', jwt);
    res.status(200).json(user.getInfo())
}

//register new user in db and send back auth cookie
exports.registerNewUser = asyncHandler((req, res, next) => {
    const { password, username } = req.body;
    if(!password || !username) throw new Error('Include username and password');
    const newUser = db.addUser(username, password);
    sendJwtResponse(newUser, res);    
})

//login an existing user
exports.loginUser = asyncHandler((req, res, next) => {
    const { username, password } = req.body;
    if(!username || !password) throw new Error('Provide username and password');
    const user = db.loginUser(username, password)
    sendJwtResponse(user, res);
})

//reassign cookie to '' to effectively unauthenticate
exports.logout = asyncHandler((req, res, next) => {
    res.cookie('auth', { expires: Date.now() });
    res.status(200).json('you have been logged out')
})

//user will be provided by authentication middleware, db will check it is still active user
exports.getUserInfo = asyncHandler((req, res, next) => {
    const { user } = req.body;
    if(!user) throw new Error('Not authorized')
    db.checkUserExists(user.username)
    res.json({ ...user })
})

//remove a user from the database
exports.removeUser = asyncHandler((req, res, next) => {
    const { username, password } = req.body;
    if (req.body.user.username !== username) throw new Error('You must be logged in to remove account');
    db.removeUser(username, password)
    res.cookie('auth', '');
    res.json('User removed')
})

//set recoverystring that will enable user reset password
exports.setRecoveryString = asyncHandler((req, res, next) => {
    const { username } = req.body;
    if(!username) throw new Error('Username not provided');
    const recoveryString = db.setRecoveryString( username );
    //add emailer function to send recovery link for front end
    res.json(recoveryString)
})

//verify recovery string, validate new password
exports.resetPassword = asyncHandler((req, res, next) => {
    const { resetString, username, password } = req.body;
    if(!resetString || !username || !password) throw new Error('Not authorized ');
    const user = db.getByUsername(username);
    user.resetPassword(resetString, username, password);
    sendJwtResponse(user, res);
})

exports.getAllUsers = asyncHandler((req, res, next) => {
    const users = db.getAllUsers();
    res.json({users})
})

exports.updateUsername = asyncHandler((req, res, next) => {
    //get new name and user from auth
    const { username } = req.body;
    const { user } = req.body
    //find user in db and pass change
    const updatedUser = db.updateUsername(user.username, username)
    sendJwtResponse(updatedUser, res);
})
