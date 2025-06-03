// This file has functions which are needed to verify and authenticate users before allowing them to perform protected routes/ actions.
import jwt from 'jsonwebtoken';

// This function just checks if the jwt token has been tampered with or exists, by verifying it.
// if it's a valid jwt token, it returns the token, otherwise it will throw an error.
//
export function verifyToken(req) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw { status: 401, message: 'No token provided' };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // typically contains user id, email, etc.
  } catch (err) {
    throw { status: 403, message: 'Invalid or expired token' };
  }
}
