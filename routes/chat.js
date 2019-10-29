const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Chat = require('../models/Chat');

/* GET ALL CHATS */
router.get('/', function(req, res, next) {
    Chat.find(function (err, products) {
        if (err) return next(err);
        res.json(products);
    });
});
  
/* GET SINGLE CHAT BY ROOM ID */
router.get('/:id', function(req, res, next) {
    
    Chat.find({room: Object(req.params.id)}, function (err, post) {
        if (err) return next(err);
        console.log(req.params.id);
        res.json(post);
    });
});
  
/* SAVE CHAT */
router.post('/', function(req, res, next) {
    
    Chat.create(req.body, function (err, post) {
        if (err) return next(err);
        
        res.json(post);
    });
});
  
/* UPDATE CHAT */
router.put('/:id', function(req, res, next) {
    Chat.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
  
/* DELETE CHAT */
router.delete('/:id', function(req, res, next) {
    Chat.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;