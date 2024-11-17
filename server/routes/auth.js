const express = require('express');
const speakeasy = require('speakeasy');
const generateQRCode = require('../utils/generateQRCode');
const { register, login, setup2FA, verify2FA } = require('../controllers/authController');
const User = require('../models/User');
const router = express.Router();


const authenticateToken = require('../middleware/authenticateToken');


router.get('/register', (req, res) => {
  const role = req.query.role || 'user'; // Если параметр role не передан, по умолчанию будет 'user'
  
  res.render('register', { 
    errorMessage: null, 
    title: "register", 
    username: null, 
    role: role // передаем роль из query
  });
});

router.get('/login', (req, res) => {
  res.render('login', { errorMessage: null, title: "login", username: null });
});

router.get('/setup-2fa', authenticateToken, async (req, res) => {
  const username = req.username;
  try {
    
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Генерация секрета для 2FA
    const secret = speakeasy.generateSecret({ name: 'MyApp' });
    console.log();
    user.twoFASecret = secret.base32;
    user.twoFAEnabled = true;
    await user.save();

    // Генерация QR-кода для 2FA
    const qrCode = await generateQRCode(secret.otpauth_url);
    // Передаем QR-код в шаблон
    res.render('setup-2fa', {qrCode: qrCode, secret: secret.base32, title: "setup2FA", errorMessage: null, username: username });
  } catch (error) {
    console.log(error);
    res.render('setup-2fa', { errorMessage: error.message });
  }
});



router.post('/register', register);
router.post('/login', login);
//router.post('/setup-2fa', authenticateToken, setup2FA);
router.post('/verify-2fa', verify2FA);
router.get('/logout', authenticateToken, (req, res) => {
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
    });
  
    res.redirect('/auth/login'); 
});


module.exports = router;
