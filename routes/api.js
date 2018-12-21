const passport = require('passport');
const config = require('../config/database');
require('../config/passport')(passport);
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require("../models/User");

router.post('/signin', function(req, res) {
  let email = req.body.login || '';
  let password = req.body.password || '';
  User.findOne({
    email: email
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.status(401).send({success: false, msg: 'User not found.'});
    } else {
      // check if password matches
      user.comparePassword(password, function (err, isMatch) {
        if (isMatch && !err) {
          let token = jwt.sign(user.toJSON(), config.secret);
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.status(401).send({success: false, msg: 'Wrong password.'});
        }
      });
    }
  });
});

module.exports = router;
