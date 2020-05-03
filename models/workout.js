const mongoose = require('mongoose');
const workoutSchema = new mongoose.Schema({
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

module.exports = Workout = mongoose.model('workout', workoutSchema);
