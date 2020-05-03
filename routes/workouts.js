const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
var workoutSchema = new mongoose.Schema({
  name: String,
  calories: Number,
  durration: Number,
  avgHeartRate: Number,
  weight: Number,
  image: String,
  description: String,
  date: { type: Date, default: Date.now },
  distance: Number,
});

var Workout = mongoose.model('Workout', workoutSchema);

// @ route GET /workouts
// @ desc renders the main workouts page
router.get('/', function (req, res) {
  Workout.find({})
    .sort({ _id: -1 }) // switches the order so the newest workouts are on top of the list
    .exec(function (err, workouts) {
      if (err) {
        console.log(err.message);
      } else {
        res.render('index', { workouts: workouts });
      }
    });
});

// @ route GET /workouts/new
// @ desc  renders the form to create a new workout
router.get('/new', function (req, res) {
  res.render('new');
});

// @ route POST /workouts
// @ desc creates and adds a workout to the db
router.post('/', function (req, res) {
  Workout.create(req.body.workout, function (err, newWorkout) {
    if (err) {
      console.log('Could not create workout. Error: ' + err.message);
    } else {
      //add default photo if one is not given
      if (newWorkout.image.trim() == '') {
        newWorkout.image =
          'https://images.unsplash.com/photo-1517836477839-7072aaa8b121?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80';
        newWorkout.save((errorSaving, savedWorkout) => {
          return;
          res.redirect('/workouts');
        });
      }
      res.redirect('/workouts');
    }
  });
});

// @ route GET /workouts/:id
// @ desc  shows the workout's page with all it's details
router.get('/:id', function (req, res) {
  Workout.findById(req.params.id, function (err, foundWorkout) {
    if (err) {
      console.log(err.message);
    } else {
      res.render('show', { workout: foundWorkout });
    }
  });
});

// @ route GET /workouts/:id/edit
// @ desc renders the form to edit a workout
router.get('/:id/edit', function (req, res) {
  Workout.findById(req.params.id, function (err, foundWorkout) {
    if (err) {
      console.log(err.message);
    } else {
      res.render('edit', { workout: foundWorkout });
    }
  });
});

// @ route PUT /workouts/:id
// @ desc updates the workout in that database
router.put('/:id', function (req, res) {
  Workout.findByIdAndUpdate(req.params.id, req.body.workout, function (
    err,
    updatedWorkout
  ) {
    if (err) {
      console.log(err.message);
    } else {
      if (updatedWorkout.image.trim() == '') {
        updatedWorkout.image =
          'https://images.unsplash.com/photo-1517836477839-7072aaa8b121?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80';
        updatedWorkout.save((errorSaving, savedWorkout) => {
          return;
          res.redirect('/workouts/' + req.params.id);
        });
      }
      res.redirect('/workouts/' + req.params.id);
    }
  });
});

// @ route DELETE /workouts/:id
// @ desc
router.delete('/:id', function (req, res) {
  Workout.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.log(err.message);
    } else {
      res.redirect('/workouts');
    }
  });
});

module.exports = router;
