const express = require('express');
const router = express.Router();

const { registerNewUser, logout, getUserInfo, removeUser, loginUser, setRecoveryString, resetPassword, getAllUsers, updateUsername } = require('../controllers/auth');
const { protected } = require('../middleware/auth');

router.post('/register', registerNewUser);
router.post('/login', loginUser)
router.post('/removeuser', protected, removeUser)
router.post('/recovery', setRecoveryString);
router.post('/resetpassword', resetPassword)
router.put('/update', protected, updateUsername)
router.get('/logout', logout);
router.get('/userinfo', protected, getUserInfo)
router.get('/users', getAllUsers)

module.exports = router;

    // //add new user to the table
    // addUser(newUser)

    // //login user
    // loginUser(username, password)

    // //remove user
    // removeUser(username, password)

    // //forgot password reset string
    // setRecoveryString(username) 

    // //get user info
    // getUserInfo(username)