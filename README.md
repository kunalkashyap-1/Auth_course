# Node.js Express App with Passport.js Authentication

This is a Node.js application built using the Express framework that demonstrates user authentication using the Passport.js library. The application allows users to register and login using both local credentials and Google OAuth.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- MongoDB
- Create a .env file with the following variables
  - SECRETSTRING
  - CLIENT_ID
  - CLIENT_SECRET
  
### Installing

1. Clone the repository
```bash
git clone https://github.com/<username>/node-express-passport-auth.git
```

2. Install the dependencies
```bash
npm install
```

3. Start the MongoDB server
```bash
mongod --port 27020
```

5. Open your browser and navigate to `http://localhost:8383`

## Built With

* [Node.js](https://nodejs.org/) - JavaScript runtime
* [Express](https://expressjs.com/) - Web framework for Node.js
* [MongoDB](https://www.mongodb.com/) - Document-oriented database
* [Passport.js](http://www.passportjs.org/) - Authentication middleware for Node.js
* [passport-local-mongoose](https://www.npmjs.com/package/passport-local-mongoose) - A Passport plugin for local authentication with Mongoose
* [passport-google-oauth20](https://www.npmjs.com/package/passport-google-oauth20) - A Passport.js strategy for authenticating with Google using OAuth 2.0
* [mongoose-findorcreate](https://www.npmjs.com/package/mongoose-findorcreate) - A plugin for Mongoose that adds a findOrCreate method to models

