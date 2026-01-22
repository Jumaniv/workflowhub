import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

interface JwtPayload {
  userId: string;
}

class AuthService {
  // Hash password before saving
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  // Compare plain password with hashed password
  static async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Generate JWT
  static generateToken(userId: Types.ObjectId): string {
    return jwt.sign(
      { userId: userId.toString() },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );
  }

  // Verify JWT
  static verifyToken(token: string): JwtPayload {
    return jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
  }
}

export default AuthService;
