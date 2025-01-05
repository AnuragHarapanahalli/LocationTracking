# Login Based Location Tracking

I've created a complete employee location tracking application with both frontend and backend components. 

Here's what each part does:

* Backend (Node.js/Express):

1. User authentication (signup/login) with JWT tokens
2. Location updates storage in MongoDB
3. API endpoints for:

   * User registration
   * User login
   * Location updates
Fetching all users' locations



* Frontend (React):
   1. Login and signup pages with forms

   2. Dashboard showing all employees' locations

   3. Automatic location tracking using the  browser's geolocation API

   4. Real-time updates every 5 seconds

## Installation

1. Install dependencies for backend:

```bash
npm install express mongoose bcrypt jsonwebtoken cors
```
2. Install dependencies for frontend:
```bash
npm install react react-router-dom axios
```
3. Start MongoDB locally or update the connection string.
4. Start the backend server:
```bash
node server.js
```
5. Start the React development server:
```bash
npm start
```


## The app uses:
* MongoDB for data storage
* JWT for authentication
* Geolocation API for location tracking
* Tailwind CSS for styling
