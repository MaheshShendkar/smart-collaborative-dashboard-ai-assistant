
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password -refreshTokens");
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user; // attach user to request
    //console.log(user);
    // console.log(req.user);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token invalid or expired" });
  }
};


export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Not authorized" });
    }
    next();
  };
};
