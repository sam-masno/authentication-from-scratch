const User = require('../models/User');
class UserLoginDB {
    constructor() {
        this.userTable = {};
        this.userCount = 0;
    }

    //add new user to the table
    addUser(username, password) {
        if(!username || !password) throw new Error('No information provided')
        if(this.userTable[username]) throw new Error('Username already in use');
        const newUser = new User(username, password);
        this.userTable[newUser.username] = newUser;
        this.userCount++;
        return newUser;
    }

    //login user
    loginUser(username, password) {
        // will throw an error if wrong password
        this.checkUserExists(username);
        this.userTable[username].comparePasswords(password);
        return this.userTable[username];
    }

    //remove user
    removeUser(username, password) {
        console.log('start of remove')
        const db = this;
        db.checkUserExists(username);
        const user = db.userTable[username];
        user.comparePasswords(password);
        delete db.userTable[username];
        db.userCount--;
        return true
    }

    //forgot password reset string
    setRecoveryString(username) {
        if(!username) throw new Error('No user provided');
        if(!this.userTable[username]) throw new Error('User not found');
        const recoveryString = this.userTable[username].generateRecoveryString();
        return recoveryString
    }

    //reset password 
    resetPasswordWithRecoveryString(recoveryString, username, password) {
        const user = this.getByUsername(username);
        user.resetPassword(recoveryString, username, password)
    }

    //get user info
    getUserInfo(username){
        const db = this
        return db.userTable[username].getInfo();
    }

    //get all users
    getAllUsers() {
        return this.userTable
    }

    //get user by username
    getByUsername(username) {
        const db = this;// use db to work around dynamic this assignments
        db.checkUserExists(username);
        console.log('in username')
        const user = db.userTable[username];
        return user;
    }

    //check user exists
    checkUserExists(username) {
        let db = this;
        if(!db.userTable[username]) throw new Error('User does not exist')
        console.log('check user exist')
    }

    //update username
    updateUsername(currentName, newName) {
        const user = this.userTable[currentName];
        user.saveUsername(newName);
        return user;
    }
}

const db = new UserLoginDB();
module.exports = db;