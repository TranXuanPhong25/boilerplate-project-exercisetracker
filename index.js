require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { User } = require('./Model.js')
const connection = mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.route('/api/users')
  .get(async (req, res) => {
    const users = await User.find({});
    res.json(users);
  })
  .post(async (req, res) => {
    const username = req.body.username;
    if (await User.findOne({ username })) {

      return res.redirect('/');
    }
    const newUser = new User({ username });
    newUser.save();
    res.json({ username, _id: newUser._id });
  });

app.route('/api/users/:id/exercises')
  .post(async (req, res) => {
    const userId = req.params.id;
    let { description, duration, date } = req.body;
    const user = await User.findById(userId);
    date = date ? new Date(date) : new Date();
    if (!user) {
      return res.json({ error: 'User not found' });
    }
    user.exercises.push({ description, duration, date });
    user.save();
    res.json({ _id: userId, username: user.username, date: date.toDateString(), duration: parseInt(duration), description });
  });
app.route('/api/users/:id/logs')
  .get(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId, '-_id').lean();
    if (!user) {
      return res.json({ error: 'User not found' });
    }
    // console.log(log);
    const { from, to, limit } = req.query;
    let log = user.exercises;
    const count = log.length;
    if (from) {
      log = log.filter(exercise => exercise.date >= new Date(from));
    }
    if (to) {
      log = log.filter(exercise => exercise.date <= new Date(to));
    }
    if (limit) {
      log = log.slice(0, limit);
    }
    log = log.map(exercise => ({
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString()
    }));
    res.json({ _id: userId, username: user.username, count: count, log });
  });





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
