const express = require('express');
const validUrl = require('valid-url'); // makes sure url's are real
const router = express.Router();

const Workout = require('../models/workout');

const defaultWorkoutImage =
    'https://images.unsplash.com/photo-1517836477839-7072aaa8b121?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80';

// @ route GET /workouts
// @ desc renders the main workouts page
router.get('/', async (req, res) => {
    try {
        let workoutsList = await Workout.find({}).sort({ _id: -1 }).exec();
        res.render('index', { workouts: workoutsList });
    } catch (err) {
        console.log(err.message);
        res.send('Unable to load workouts. Server Error');
    }
});

// @ route GET /workouts/new
// @ desc  renders the form to create a new workout
router.get('/new', (req, res) => res.render('new'));

// @ route POST /workouts
// @ desc creates and adds a workout to the db
router.post('/', async (req, res) => {
    try {
        let newWorkout = await Workout.create(req.body.workout);

        if (!validUrl.isUri(newWorkout.image.trim())) {
            newWorkout.image = defaultWorkoutImage;
            await newWorkout.save();
        }
    } catch (err) {
        console.log('Could not create workout. Error: ' + err.message);
    }
    res.redirect('/workouts');
});

// @ route GET /workouts/:id
// @ desc  shows the workout's page with all it's details
router.get('/:id', async (req, res) => {
    try {
        res.render('show', { workout: await Workout.findById(req.params.id) });
    } catch (err) {
        console.log(err.message);
        res.redirect('/');
    }
});

// @ route GET /workouts/:id/edit
// @ desc renders the form to edit a workout
router.get('/:id/edit', async (req, res) => {
    try {
        res.render('edit', { workout: await Workout.findById(req.params.id) });
    } catch (err) {
        console.log(err.message);
        res.redirect('/');
    }
});

// @ route PUT /workouts/:id
// @ desc updates the workout in that database
router.put('/:id', async (req, res) => {
    try {
        let updatedWorkout = await Workout.findByIdAndUpdate(
            req.params.id,
            req.body.workout
        );

        if (!validUrl.isUri(updatedWorkout.image.trim())) {
            updatedWorkout.image = defaultWorkoutImage;
            await updatedWorkout.save();
        }
        res.redirect('/workouts/' + req.params.id);
    } catch (err) {
        console.log(err.message);
        res.redirect('/');
    }
});

// @ route DELETE /workouts/:id
// @ desc
router.delete('/:id', async (req, res) => {
    try {
        await Workout.findByIdAndRemove(req.params.id);
        res.redirect('/workouts');
    } catch (err) {
        console.log(err.message);
    }
});

module.exports = router;
