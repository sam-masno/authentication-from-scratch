const express = require('express');
const app = express();
//routers
const routers = require('./routes/routers');
const errorHandler = require('./middleware/errorHandler');
//init db 
require('./services/db');

//middlewares
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

routers(app);
app.use(errorHandler)

const PORT = 5000;

app.listen(PORT, () => console.log('Login server running'))