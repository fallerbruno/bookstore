const cors = require('cors');
const router = require('express').Router();
const users = require('./users');
const states = require('./states');
const cities = require('./cities');
const publishers = require('./publishers');
const categories = require('./categories');
const book = require('./books');
const format = require('./format');
router.use(cors());

router.use(users);
router.use(states);
router.use(cities);
router.use(publishers);
router.use(categories);
router.use(book);
router.use(format);

module.exports = router;
