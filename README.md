# Project Name: **User Authentication with Two-Factor Authentication and Portfolio Management**

## Overview

This project implements a secure user authentication system with added features for managing a **Portfolio** and integrating a fun **Cat API**. Key highlights include:  
- **User Registration & Login**: Secure authentication with optional Two-Factor Authentication (2FA).  
- **Portfolio Management**: CRUD operations for portfolios with notifications upon new portfolio creation.  
- **Cat API Integration**: Provides adorable cat pictures to enhance user engagement.  
- **Email Notifications**: Sends notifications when new portfolios are created.  

## Features

### **Authentication**
- Secure login and registration using hashed passwords and JWT-based authentication.  
- Two-Factor Authentication (2FA) using `speakeasy` for added security.  

### **Portfolio Management**
- **CRUD Operations**:
  - Create, Read, Update, and Delete portfolios.
- Sends email notifications whenever a new portfolio is created.  

### **Cat API Integration**
- Access cute cat pictures via the Cat API.  

### **Frontend**
- Dynamic navigation bar reflecting user authentication state.  
- AJAX-based login and portfolio forms for seamless interaction.  

### **Backend**
- RESTful API endpoints for authentication, portfolio management, and Cat API access.  

---

## Technologies Used

### Backend
- **Node.js**: Backend runtime environment.
- **Express.js**: Framework for RESTful API.
- **Mongoose**: MongoDB ORM for managing data.  
- **bcrypt**: For secure password hashing.  
- **JWT (jsonwebtoken)**: For token-based authentication.  
- **Speakeasy**: For generating and verifying TOTP-based 2FA codes.  
- **Nodemailer**: For sending email notifications.  

### Frontend
- **EJS**: Dynamic templating engine.  
- **JavaScript**: For client-side interactivity.  

### APIs
- **Cat API**: Fetches random cat pictures to display on the site.  

### Database
- **MongoDB**: Stores user data, portfolio information, and other content.  

---

## Installation

### Prerequisites
- **Node.js** and **npm** installed.  
- **MongoDB** running locally or accessible remotely.  

### Steps
1. Clone the repository:  
   ```bash
   git clone https://github.com/your-username/your-project.git
   cd your-project
   ```
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Set up environment variables:  
   Create a `.env` file in the root directory with the following:  
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/your-database
   JWT_SECRET=your-secret-key
   NODE_ENV=development
   CAT_API_URL=https://api.thecatapi.com/v1/images/search
   CAT_API_KEY=your-cat-api-key
   ```
4. Start the server:  
   ```bash
   npm start
   ```
5. Open the app in your browser:  
   Navigate to `http://localhost:3000`.  

---

## API Endpoints

### **Authentication**
| Method | Endpoint           | Description                     |
|--------|--------------------|---------------------------------|
| POST   | `/auth/register`    | User registration              |
| POST   | `/auth/login`       | User login                     |
| POST   | `/auth/logout`      | User logout                    |
| GET    | `/auth/setup2fa`    | Generate 2FA QR code           |
| POST   | `/auth/verify2fa`   | Verify 2FA code and login      |

### **Portfolio Management**
| Method | Endpoint           | Description                     |
|--------|--------------------|---------------------------------|
| POST   | `/portfolio/create` | Create a new portfolio          |
| GET    | `/portfolio/:id`    | Get portfolio details by ID     |
| PUT    | `/portfolio/:id`    | Update portfolio by ID          |
| DELETE | `/portfolio/:id`    | Delete portfolio by ID          |

### **Cat API**
| Method | Endpoint           | Description                     |
|--------|--------------------|---------------------------------|
| GET    | `/cats/random`      | Fetch a random cat picture      |

---

---

## Usage

1. **Register a User**:  
   Navigate to `/register`, fill out the form, and submit.  

2. **Login**:  
   Go to `/login`, provide credentials, and log in. If 2FA is enabled, follow the prompts.  

3. **Enable 2FA**:  
   After logging in, navigate to `/auth/setup2fa` and scan the QR code with an authenticator app.  

4. **Manage Portfolios**:  
   Use the `/portfolio` routes for creating, viewing, updating, and deleting portfolios.  

5. **Cat API Fun**:  
   Visit `/cats/random` to see a cute random cat picture!  

---

## Notifications

- An email notification is sent to the user when a new portfolio is created.  

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.  

---

## Contributions

Contributions, issues, and feature requests are welcome! Fork the repository and submit a pull request.  

---

Let me know if you'd like additional edits or enhancements!