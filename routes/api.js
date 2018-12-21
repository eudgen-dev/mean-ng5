const mongoose = require('mongoose');
const passport = require('passport');
const config = require('../config/database');
require('../config/passport')(passport);
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require("../models/User");
const Task = require("../models/Task");

router.post('/signin', function(req, res) {
  let email = req.body.login || '';
  let password = req.body.password || '';

  User.findOne({
    email: email
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(password, function (err, isMatch) {
        if (isMatch && !err) {
          let token = jwt.sign(user.toJSON(), config.secret);
          res.json({success: true, token: 'JWT ' + token, userName: user.name});
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

router.post('/tasks', passport.authenticate('jwt', { session: false}), function(req, res) {
  let newTask = new Task({
    title: req.body.title,
    dueOn: req.body.dueOn,
    userId: req.user.id
  });

  newTask.save(function(err) {
    if (err) {
      return res.json({success: false, msg: 'Save tasks failed.'});
    }
    res.json({success: true, msg: 'Successful created new tasks.'});
  });
});

router.put('/tasks/:id', passport.authenticate('jwt', { session: false}), function(req, res) {

  let taskId = req.params.id || null;
  if(!taskId){
    return res.json({success: false, msg: 'taskId is required'});
  }

  let task = {
    title: req.body.title,
    dueOn: req.body.dueOn,
    userId: req.user.id
  };

  Task.findByIdAndUpdate(taskId, {
    $set: task,
  }).then(function(task){
    return res.json({success: true, msg: 'Save tasks success.'});
  }).catch(function(error){
    return res.status(404).json({success: false, msg: 'Task doesn\'t exist'});
  });

});

router.delete('/tasks/:id', passport.authenticate('jwt', { session: false}), function(req, res) {
  let taskId = req.params.id || null;
  if(!taskId){
    return res.json({success: false, msg: 'taskId is required'});
  }
  Task.find({_id: taskId}).remove(function(){
    return res.json({success: true});
  });
});

router.get('/tasks', passport.authenticate('jwt', { session: false}), function(req, res) {
  Task.find({userId: req.user.id},function (err, tasks) {
    if (err) return next(err);
    res.json(tasks);
  });
});

module.exports = router;
