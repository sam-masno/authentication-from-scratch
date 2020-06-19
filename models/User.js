const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const { passwordRegex, passwordStandard, usernameRegex, usernameStandard } = require('../constants/Regexes');

class User {
    constructor(username, password){
        this.password = this.savePassword(password);
        this.username = this.saveUsername(username);
        this._id = uuid.v4();
    }

    role = "user";
    recoveryString = '';

    getInfo() {
        return { _id: this._id, username: this.username, role: this.role }
    }

    //validate incoming username and save
    saveUsername(username) {
        if(!usernameRegex.test(username)) throw new Error(usernameStandard)
        if(this.username) this.username = username
        return username;
    }

    // validate incoming name and save
    updateUserName(username) {
        this.username = this.saveUserName(username)
    }

    //validate incoming password and save
    savePassword(password) {
        if(!passwordRegex.test(password)) throw new Error(passwordStandard)
        const salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        return hash;
    }

    //reset password 
    resetPassword(recoveryString, username, password) {
        this.verifyRecoveryString(recoveryString, username);
        this.updatePassword(password);
    }

    // update password after account recovery
    updatePassword(newPassword) {
        this.password = this.savePassword(newPassword);
        this.recoveryString = '';
    }

    //validate incoming challenge password
    comparePasswords(challenge) {
        if(!bcrypt.compareSync(challenge, this.password)) throw new Error('Incorrect password')
    }

    //generate a recovery string in case of new password etc
    generateRecoveryString() {
        this.recoveryString = uuid.v4();
        return this.recoveryString;
    }

    //check recovery string
    verifyRecoveryString(string, username) {
        if(this.recoveryString !== string) throw new Error('Not authorized')
    }

    //get signed jwt
    getSignedJwt(){
        const { _id, username, role } = this;
        return jwt.sign({ _id, username, role }, process.env.JWT_SECRET, { expiresIn: '24h' } )
    }
}

module.exports = User;
