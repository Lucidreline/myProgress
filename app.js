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

// @ route GET /
// @ desc redirects to /workouts since there isnt a landing page
app.get('/', (req, res) => res.redirect('/workouts')); // This is where people will go when they open the website,
// this will automaticly take them into the page with all workouts

app.use('/workouts', require('./routes/workouts'));

app.listen(process.env.PORT, function () {
  console.log(`Server is Online on port ${process.env.PORT}`);
});
