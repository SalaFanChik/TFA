const { User } = require('../models/User'); 

const isAdmin = (req, res, next) => {
  const user = req.user;  
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ запрещен. Только для администраторов.' });
  }

  next();
};

module.exports = isAdmin;
