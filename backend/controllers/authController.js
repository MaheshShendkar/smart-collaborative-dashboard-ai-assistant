
import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

//
// REGISTER
//
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already in use" });

    const user = await User.create({ name, email, password, role });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // atomic update instead of save (avoid stale doc)
    await User.findByIdAndUpdate(user._id, { $push: { refreshTokens: refreshToken } });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

//
// LOGIN
//
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password +refreshTokens");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await User.findByIdAndUpdate(user._id, { $push: { refreshTokens: refreshToken } });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

//
// REFRESH TOKEN
//
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "Refresh token missing" });

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const user = await User.findById(payload.id).select("+refreshTokens");
    if (!user) return res.status(401).json({ message: "User not found" });

    if (!user.refreshTokens.includes(token)) {
      // suspicious reuse → revoke all
      await User.findByIdAndUpdate(user._id, { $set: { refreshTokens: [] } });
      return res.status(401).json({ message: "Refresh token revoked" });
    }

    const newAccess = generateAccessToken(user._id);
    const newRefresh = generateRefreshToken(user._id);

    // rotate using atomic update
    // await User.findByIdAndUpdate(user._id, {
    //   $pull: { refreshTokens: token },
    //   $push: { refreshTokens: newRefresh },
    // });

    await User.findByIdAndUpdate(user._id, { $pull: { refreshTokens: token } });
    await User.findByIdAndUpdate(user._id, { $push: { refreshTokens: newRefresh } });

    res.cookie("refreshToken", newRefresh, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: newAccess });
  } catch (err) {
    next(err);
  }
};

//
// LOGOUT
//
export const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      const payload = jwt.decode(token);
      if (payload?.id) {
        await User.findByIdAndUpdate(payload.id, {
          $pull: { refreshTokens: token },
        });
      }
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
};

//
// GET /api/auth/me
//
export const me = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    next(err);
  }
};
