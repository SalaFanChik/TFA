// routes/portfolio.js
const express = require('express');
const PortfolioItem = require('../models/PortfolioItem');
const isAdmin = require('../middleware/isAdmin');
const User = require('../models/User');
const authenticateToken = require('../middleware/authenticateToken');
const multer = require('multer');
const path = require('path');
const sendEmailToAll = require('../utils/SendEmailToAll');

const router = express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});


const upload = multer({ storage: storage });


router.get('/portfolio', authenticateToken, async (req, res) => {
    const username = req.username || null;
    let role = 'user';
    console.log(username);
    try {
      const user = await User.findOne({ username });
  
      if (user) {
        role = user.role; 
      }
  
      const portfolioItems = await PortfolioItem.find({ deletedAt: null });
  
      res.render('portfolio', { 
        portfolioItems, 
        title: "Portfolio", 
        username: username, 
        role: role 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

  
router.get('/portfolio/create', authenticateToken, async (req, res) => {
    const username = req.username || null;
    let role = 'user'; 
  
    try {
      const user = await User.findOne({ username });
      if (user) {
        role = user.role; 
      }
  
      if (role !== 'admin' && role !== 'editor') {
        return res.status(403).json({ message: 'You do not have permission to create portfolio items.' });
      }
  
      res.render('createPortfolio', { errorMessage: null, role: role, title: "Create", username: user.username });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});


router.post('/portfolio', upload.any('images'), async (req, res) => {
  try {
    if (!req.files || req.files.length < 3) {
      return res.status(400).json({ message: 'At least three images are required' });
    }

    const { title, description } = req.body;

    const images = req.files.map(file => file.path);

    const newPortfolioItem = new PortfolioItem({
      title,
      description,
      images,
    });

    await newPortfolioItem.save();
    const subject = 'New Portfolio Item Created';
    const text = `A new portfolio item titled "${title}" has been created. Check it out now!`;

    await sendEmailToAll(subject, text);

    res.redirect('/blog/portfolio');
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: error.message });
  }
});

  

router.get('/portfolio/edit/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const username = req.username || null;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const portfolioItem = await PortfolioItem.findById(id);

    if (!portfolioItem) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    res.render('editPortfolio', { 
      portfolioItem, 
      role: user.role,
      username: user.username,
      title: "Edit"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/portfolio/edit/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, images } = req.body;

  try {
    const portfolioItem = await PortfolioItem.findById(id);

    if (!portfolioItem) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    portfolioItem.title = title || portfolioItem.title;
    portfolioItem.description = description || portfolioItem.description;
    portfolioItem.images = images || portfolioItem.images;
    portfolioItem.updatedAt = Date.now();

    await portfolioItem.save();
    res.redirect('/blog/portfolio');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/portfolio/delete/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const portfolioItem = await PortfolioItem.findById(id);

    if (!portfolioItem) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    await PortfolioItem.findByIdAndDelete(id);

    res.redirect('/blog/portfolio'); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
