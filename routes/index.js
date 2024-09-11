const express = require('express');
const reposRouter = require('./repos');
const router = express.Router();

router.use('/repos', reposRouter);

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Repos' });
});

module.exports = router;
