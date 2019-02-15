var express          = require("express"),
    expressSanitizer = require("express-sanitizer"),
    mongoose         = require("mongoose"),
    bodyParser       = require("body-parser"),
    methodOverride   = require("method-override"),
    
    app              = express();
  
  
mongoose.connect("mongodb://localhost:27017/progress", { useNewUrlParser: true })
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"))
app.use(expressSanitizer())

var workoutSchema = new mongoose.Schema({
    name: String,
    calories: Number,
    durration: Number,
    avgHeartRate: Number,
    weight: Number,
    image: {type: String, default: "https://images.unsplash.com/photo-1517836477839-7072aaa8b121?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"},
    description: String,
    date: {type: Date, default:Date.now},
    distance: Number
});

var Workout = mongoose.model("Workout", workoutSchema);


app.get("/", function(req, res){
    res.redirect("/workouts");
})
// This is where people will go when they open the website,
// this will automaticly take them into the page with all workouts


//index
app.get("/workouts", function(req, res){
    Workout.find({}).sort({"_id": -1}).exec(function(err, workouts){
        if(err){
            console.log("Something went wrong");
        }else{
            res.render("index", {workouts: workouts})
        }
    })
})

//new
app.get("/workouts/new", function(req, res){
    res.render("new");
})

//create
app.post("/workouts", function(req,res){
    Workout.create(req.body.workout, function(err, newWorkout){
        if(err){
            console.log("Something went wrong");
        }else{
            res.redirect("/workouts");
        }
    })
})

//show
app.get("/workouts/:id", function(req, res){
    Workout.findById(req.params.id, function(err, foundWorkout){
        if(err){
            console.log("Something Went Wrong");
        }else{
            res.render("show", {workout: foundWorkout})
        }
    })
    
})

//edit
app.get("/workouts/:id/edit", function(req, res){
    Workout.findById(req.params.id, function(err, foundWorkout){
        if(err){
            console.log("Something Went Wrong");
        }else{
            res.render("edit", {workout: foundWorkout})
        }
    })
})

//update
app.put("/workouts/:id", function(req, res){
    Workout.findByIdAndUpdate(req.params.id, req.body.workout, function(err, updatedWorkout){
        if(err){
            console.log("something went wrong");
        }else{
            res.redirect("/workouts/" + req.params.id)
        }
    })
})


// app.put("/workouts/:id", function(req, res){
//     //req.body.blog.body = req.sanitize(req.body.blog.body);
//     Workout.findByIdAndUpdate(req.params.id, req.body.workout, function(err, updatedWorkout){
//         if(err){
//             console.log("X")
//         }else{
//             res.redirect("/workouts/" + req.params.id)
//         }
//     })
// })



//destroy
app.delete("/workouts/:id", function(req, res){
    Workout.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log("something went Wrong")
        }else{
            res.redirect("/workouts")
        }
    })
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is Online")
})
