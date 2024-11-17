require('dotenv').config();
const express = require('express');
const mongoose = require('./config/db');
const authRoutes = require('./routes/auth');
const generalRoutes = require('./routes/general');
const adminRoutes = require('./routes/admin');
const editorRoutes = require('./routes/editor');
const path = require('path');
const cors = require('cors');
const cookieparser = require('cookie-parser')
const expressLayouts = require('express-ejs-layouts');
const portfolioRoutes = require('./routes/portfolio');

const app = express();

app.use(expressLayouts);
app.set('layout', 'base'); 
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors())
app.use(cookieparser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/blog', portfolioRoutes);



app.use('/auth', authRoutes);
app.use('/', generalRoutes);
// app.use('/admin', adminRoutes);
// app.use('/editor', editorRoutes); 


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
