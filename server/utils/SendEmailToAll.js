const nodemailer = require('nodemailer');
const User = require('../models/User');  

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});


const sendEmailToAll = async (subject, text) => {
  try {
    const users = await User.find();
    
    const emailList = users.map(user => user.email);
    
    if (emailList.length === 0) {
      console.log('No users found to send the email');
      return;
    }

    for (const email of emailList) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,  
        to: email,                    
        subject,                      
        text,                        
      });

      console.log(`Email sent to ${email}`);  
    }
  } catch (error) {
    console.error('Error sending emails to users:', error);
  }
};

module.exports = sendEmailToAll;
