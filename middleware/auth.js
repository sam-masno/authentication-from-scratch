const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.protected = asyncHandler((req, res, next) => {
    const { auth } = req.cookies;
    if(!auth) throw new Error('Not authorized');
    const user = jwt.verify(auth, process.env.JWT_SECRET);
    req.body.user = user;
    next()
})