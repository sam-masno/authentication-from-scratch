module.exports.passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/

module.exports.passwordStandard = 'Password must be  6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter';

module.exports.usernameStandard = "Your user name is not valid. Only characters A-Z, a-z and '-' are  acceptable. Must be between 5 and 16 characters."

module.exports.usernameRegex = /^[a-zA-Z0-9-]{5,16}/
