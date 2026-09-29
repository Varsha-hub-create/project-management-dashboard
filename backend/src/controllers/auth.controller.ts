import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { pool } from "../config/database";
import { AuthRequest } from "../types/auth";

const JWT_SECRET = process.env.JWT_SECRET!;

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function createToken(userId: number) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1d" });
}

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid registration data",
    });
  }

  const { name, email, password } = parsed.data;

  const existing = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [email.toLowerCase()]
  );

  if (existing.rows.length > 0) {
    return res.status(409).json({
      success: false,
      message: "Email already registered",
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email`,
    [name, email.toLowerCase(), passwordHash]
  );

  const user = result.rows[0];

  return res.status(201).json({
    success: true,
    data: {
      user,
      token: createToken(user.id),
    },
  });
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid login data",
    });
  }

  const { email, password } = parsed.data;

  const result = await pool.query(
    "SELECT id, name, email, password_hash FROM users WHERE email = $1",
    [email.toLowerCase()]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const user = result.rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  return res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token: createToken(user.id),
    },
  });
}

export async function me(req: Request, res: Response) {
  const user = (req as AuthRequest).user;

  return res.json({
    success: true,
    data: user,
  });
}
