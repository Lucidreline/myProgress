require('dotenv').config(); // allows us to user the .env file to store environmental variables

const express = require('express'),
  expressSanitizer = require('express-sanitizer'), // prevents people from entering javascript in a form input
  mongoose = require('mongoose'), // allows us to connect to a database
  bodyParser = require('body-parser'), // allows us to use req.body when we take info from a form in a POST or PUT route
  methodOverride = require('method-override'),
  app = express();

mongoose.connect(process.env.MONGODB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});

app.set('view engine', 'ejs'); // allows us to not have to keep repeating .ejs at the end of each ejs rendering

app.use(bodyParser.urlencoded({ extended: true, useNewUrlParser: true })); // allows us to take information from the url after a form is submitted
app.use(express.static('public')); // tells the app where to look for strylesheets, scripts, photos, etc
app.use(methodOverride('_method')); // allows us to use methods (such as put and delete) in forms that html does not include
app.use(expressSanitizer());

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

app.get('/', function (req, res) {
  res.redirect('/workouts');
});
// This is where people will go when they open the website,
// this will automaticly take them into the page with all workouts

// @ route GET /workouts
// @ desc renders the main workouts page
app.get('/workouts', function (req, res) {
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
app.get('/workouts/new', function (req, res) {
  res.render('new');
});

// @ route POST /workouts
// @ desc creates and adds a workout to the db
app.post('/workouts', function (req, res) {
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
app.get('/workouts/:id', function (req, res) {
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
app.get('/workouts/:id/edit', function (req, res) {
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
app.put('/workouts/:id', function (req, res) {
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
app.delete('/workouts/:id', function (req, res) {
  Workout.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.log(err.message);
    } else {
      res.redirect('/workouts');
    }
  });
});

app.listen(process.env.PORT, function () {
  console.log(`Server is Online on port ${process.env.PORT}`);
});
