const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const server = express();

const projects = require('./data/helpers/projectModel.js');
const actions = require('./data/helpers/actionModel.js');

//MIDDLEWARE

server.use(morgan('short'));
server.use(helmet());
server.use(cors());
server.use(express.json());

const url = '/api/projects/';
const actionsurl = '/api/actions';



module.exports = server

