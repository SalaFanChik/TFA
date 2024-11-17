const express = require('express');
const User = require('../models/User'); 
const authenticateToken = require('../middleware/authenticateToken');

const API_URL = 'https://api.football-data.org/v4/matches';
const API_KEY = '344fe61d37454091944c757391f4cd30'; 

const axios = require('axios');


const router = express.Router();

router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.username });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(user.twoFAEnabled)
    res.render('dashboard', {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      gender: user.gender,
      twoFAEnabled: user.twoFAEnabled, 
      title: "Dashboard"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', authenticateToken, async (req, res) => {
    try {
      res.render('index', { title: 'Home', username: req.username });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

router.get('/cat', authenticateToken, async (req, res) => {
  try {
    const response = await axios.get('https://api.thecatapi.com/v1/images/search');
    const catImage = response.data[0]; 

    res.render('cat', { imageUrl: catImage.url, title: "Cat", username: req.username });
  } catch (error) {
    console.error('Error fetching data from Cat API:', error);
    res.status(500).send('Error fetching data');
  }
});

module.exports = router;


