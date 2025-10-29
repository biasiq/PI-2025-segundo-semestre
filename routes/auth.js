const express = require('express');

const router = express.router();

router.post('/', (req, res) => {
    res.render('index');
});

module.exports = router;