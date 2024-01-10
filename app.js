const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a user model
const User = mongoose.model('User', {
  name: String,
  email: String,
  password: String,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Set the views directory path
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
app.use(express.static('public'));


// Routes
app.get('/', (req, res) => {
    res.render('login', { error: null }); // Passing an object with 'error' property
  });
  
  app.get('/signup', (req, res) => {
    res.render('signup');
  });

app.post('/signup', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.render('signup', { error: 'Passwords do not match' });
  }

  // Create a new user
  const newUser = new User({
    name,
    email,
    password,
  });

  // Save the user to the database
  try {
    await newUser.save();
    res.redirect('/');
  } catch (err) {
    res.render('signup', { error: 'Error creating user' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });
    if (user) {
      res.send('Login successful!');
    } else {
      res.render('login', { error: 'Invalid credentials' });
    }
  } catch (err) {
    res.render('login', { error: 'Error logging in' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
