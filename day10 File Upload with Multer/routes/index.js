var express = require('express');
var router = express.Router();
var path = require('path');
// var client=require('../sql/main')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// router.get('/users', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM users');
//     res.json(result.rows);
//   } catch (err) {
//     console.error('Error fetching users:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


router.get('/ab',function(req, res, next) {
  res.json({message: "hello world"})
})

router.post('/abc',function(req, res, next) {
  res.json({message: "hello world post"})
})

router.put('/abcd',function(req, res, next) {
  res.json({message: "hello world put"})
})

router.delete('/abcde',function(req, res, next) {
  res.json({message: "hello world delete"})
})

router.get('/y', function (req, res) {
  res.sendFile(path.join(__dirname, '../public/y.html'));
});

router.get('/redirect', function (req, res) {
  res.redirect('https://www.instagram.com');
});









module.exports = router;
