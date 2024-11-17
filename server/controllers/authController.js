const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');
const generateQRCode = require('../utils/generateQRCode');
const sendEmail = require('../utils/sendEmail');


const createToken = (username, role) => {
  return jwt.sign({ username, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.register = async (req, res) => {
  try {
    const { username, password, firstName, lastName, age, gender, role } = req.body;

    const userRole = role || 'user';

    const newUser = await User.create({
      username,
      password,
      firstName,
      lastName,
      age,
      gender,
      role: userRole,
    });

    await sendEmail(newUser.username, 'Welcome!', 'Thank you for registering!');

    res.redirect('/auth/login'); 
  } catch (error) {
    res.render('register', { errorMessage: error.message });
  }
};



exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    if (user.twoFAEnabled) {
      return res.render('verify-2fa', { username: user.username, errorMessage: null, title: "Verify" });
    }


    const token = createToken(user.username, user.role);
    
    res
      .cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000,
      })
      .redirect('/dashboard'); 

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.setup2FA = async (req, res) => {
  const username = req.username;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const secret = speakeasy.generateSecret({ name: 'MyApp' });
    user.twoFASecret = secret.base32;
    user.twoFAEnabled = true;
    await user.save();

    const qrCode = await generateQRCode(secret.otpauth_url);
    
    res.render('setup2fa', { qrCode, secret: secret.base32, title: "setup2FA" });
  } catch (error) {
    res.render('setup2fa', { errorMessage: error.message });
  }
};


exports.verify2FA = async (req, res) => {
  const { username, token } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const verified = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: 'base32',
      token,
    });

    if (!verified) {
      return res.render('verify-2fa', { 
        username: user.username, 
        errorMessage: 'Invalid 2FA code' 
      });
    }

    user.twoFAEnabled = true;
    await user.save();

    const authToken = createToken(user.username, user.role);

    res
      .cookie('authToken', authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000,
      })
      .redirect('/dashboard');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
