require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const http = require('http');
const router = require('./router');
const mongoose = require('mongoose');

// DB setup
mongoose.connect('mongodb://localhost/sg_auth', {useNewUrlParser: true});

// App Setup
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
router(app);

// Server Setup
const PORT = process.env.PORT || 3090;
const server = http.createServer(app);

server.listen(PORT, () => {
	console.log(`listening on port ${PORT}`)
});