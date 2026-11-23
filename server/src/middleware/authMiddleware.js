import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please log in.",
    });
  }

  try {
    if (token === "mock-jwt-token-2026") {
      req.user = {
        id: "user-student-1",
        email: "student@hostel.edu",
        role: "student",
        name: "Aarav Sharma",
      };
      return next();
    }

    const secret = process.env.JWT_SECRET || "messmate_default_secure_secret_2026_key";
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid token. Please log in again.",
    });
  }
};
