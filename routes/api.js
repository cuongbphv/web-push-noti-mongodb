const Task = require('../models/Task');
const User = require('../models/User');
const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    Task.find({}, function(err, tasks) {
        res.render('index', { title: 'Demo Web Push with MongoDB Change', message: 'Hello there!', tasks: tasks })
      });
});

router.post('/subscribe', (req, res) => {
    User.create({
        endpoint: req.body.endpoint,
        keys: req.body.keys
    }, (err, task) => {
        if (err) {
            console.log('CREATE Error: ' + err);
            res.status(500).send('Error');
        } else {
            res.status(200).json(task);
        }
    });
});

router.post('/new', (req, res) => {
    Task.create({
        task: req.body.task,
    }, (err, task) => {
        if (err) {
            console.log('CREATE Error: ' + err);
            res.status(500).send('Error');
        } else {
            res.status(200).json(task);
        }
    });
});

router.delete('/:id', (req, res) => {
    Task.findById(req.params.id, (err, task) => {
        if (err) {
            console.log('DELETE Error: ' + err);
            res.status(500).send('Error');
        } else if (task) {
            task.remove(() => {
                res.status(200).json(task);
            });
        } else {
            res.status(404).send('Not found');
        }
    });
});

module.exports = router;