import { Request, Response } from "express";
import User from "../models/User";
import Organization from "../models/Organization";
import Membership from "../models/Membership";
import AuthService from "../services/authService";
import { AppError } from "../utils/AppError";

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, organizationName } = req.body;

    //  Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // return res.status(400).json({ message: "User already exists" });

      // Using error throwing to be caught by global error handler
      // throw { statusCode: 400, message: "User already exists" };

      throw new AppError("User already exists", 400);

    }

    //  Hash password
    const hashedPassword = await AuthService.hashPassword(password);

    //  Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    //  Create organization
    const organization = await Organization.create({
      name: organizationName,
      owner: user._id
    });

    //  Create membership (ADMIN)
    await Membership.create({
      user: user._id,
      organization: organization._id,
      role: "ADMIN"
    });

    // Generate token
    const token = AuthService.generateToken(user._id);

    res.status(201).json({
      token,
      userId: user._id,
      organizationId: organization._id
    });
  } catch (error) {
    // res.status(500).json({ message: "Signup failed" });

    // Using error throwing to be caught by global error handler
    throw { statusCode: 500, message: "Signup failed" };
  }
};
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // return res.status(400).json({ message: "Invalid credentials" });

      // Using error throwing to be caught by global error handler
      throw { statusCode: 400, message: "Invalid credentials" };
    }

    // Compare password
    const isMatch = await AuthService.comparePassword(
      password,
      user.password
    );

    if (!isMatch) {
      // return res.status(400).json({ message: "Invalid credentials" });

      // Using error throwing to be caught by global error handler
      throw { statusCode: 400, message: "Invalid credentials" };
    }

    // Generate token
    const token = AuthService.generateToken(user._id);

    res.json({
      token,
      userId: user._id
    });
  } catch (error) {
    // res.status(500).json({ message: "Login failed" });

    // Using error throwing to be caught by global error handler
    throw { statusCode: 500, message: "Login failed" };
  }
};

