requ('dotenv').config();
const Sequelize = require('sequelize');
const db = require('../db');
const user = require('./models/User');

user.sync();