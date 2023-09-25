// Import necessary modules and dependencies
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware function to check user role
function roleCheckMiddleware(req, res, next) {
  try {
    // Extract the user's token from the request (e.g., from cookies or headers)
    const { token } = req.cookies;
    
    // Check if the token is missing
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Token is present, verify it to ensure it's valid
    jwt.verify(token, process.env.SECRET, (err, userInfo) => {
      if (err) {
        console.error('Token verification error:', err);
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Token is valid, assume the user role is stored in userInfo.userRole
      const userRole = userInfo.userRole;

      // Check the user's role and determine if they have permission
      if (userRole === 'admin') {
        // The user has 'admin' role, so they are authorized
        next(); // Continue to the next middleware or route handler
      } else {
        console.error('Unauthorized access. User does not have admin role.');
        res.status(403).json({ error: 'Forbidden' });
      }
    });
  } catch (error) {
    console.error('Error in roleCheckMiddleware:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = roleCheckMiddleware;
