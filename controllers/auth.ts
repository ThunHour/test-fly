import express, { NextFunction, Request, Response, Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { addRefreshTokenToWhitelist, deleteRefreshToken, findRefreshTokenById, revokeTokens } from '../services/auth';
const router: Router = express.Router();
import { generateTokens, hashToken } from '../utils/jwt';
import { SuperAdmin, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TokenPayload } from '../interfaces';
import { createSuperAdmin, findSuperAdminByUsername } from '../services/superadmin';
import { createUserByEmailAndPassword, findUserByEmail, findUserById } from '../services/user';
import { hash } from 'bcrypt';

/**
 * POST /register
 * @summary  register a school
 * @param {string} email the email of the new school
 * @param {string} password the password of the new school
 * @param {string} name the name of the new school
 * @param {string} address the address of the new school
 * @param {string} phone the phone of the new school
 * @param {string} website the website of the new school
 * @param {string} logo the logo of the new school
 * @param {string} description the description of the new school
 * @returns {object} 200 - success response
 * @returns {object} 400 - Bad request response
 * @example response - 200 - success response example
 *  {
 *   "accessToken":"accessToken",
 *  "refreshToken":"refreshToken"
 */
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Create School
    const { username, email, password, phone, description} = req.body;
    if (!username|| !password || !email || !phone) {
      res.status(400);
      throw new Error('You must provide an email, password, and name.');
    }
    // Check Exist School name or user
    const existingSuperAdmin = await findSuperAdminByUsername(username);
    const existingUser = await findUserByEmail(email);
    if (existingSuperAdmin || existingUser) {
      res.status(400);
      throw new Error('SuperAdmin name or user already in used.');
    }

    // Validate Input
    const superAdminData= {
      username,
      email,
      phone,
      description,
      createdAt: new Date(),
      deletedAt: null,
      updatedAt: new Date(),
    } as SuperAdmin;
    // Create School
    await createSuperAdmin(superAdminData);

    const userData = {
      username,
      email,
      password,
      phone,
      Role: 'superAdmin',
    } as User;

    const user = await createUserByEmailAndPassword(userData);
    const jti = uuidv4();
    const { accessToken, refreshToken } = generateTokens(user, jti);
    await addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.id });

    res.json({
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error('You must provide an email and a password.');
    }

    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      res.status(403);
      throw new Error('Invalid login credentials.');
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      res.status(403);
      throw new Error('Invalid login credentials.');
    }

    const jti = uuidv4();
    const { accessToken, refreshToken } = generateTokens(existingUser, jti);
    await addRefreshTokenToWhitelist({ jti, refreshToken, userId: existingUser.id });

    res.json({
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/refreshToken', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400);
      throw new Error('Missing refresh token.');
    }
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET) as TokenPayload;
    const savedRefreshToken = await findRefreshTokenById(payload.jti);

    if (!savedRefreshToken || savedRefreshToken.revoked === true) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    const hashedToken = hashToken(refreshToken);
    if (hashedToken !== savedRefreshToken.hashedToken) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    const user = await findUserById(payload.userId);
    if (!user) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    await deleteRefreshToken(savedRefreshToken.id);
    const jti = uuidv4();
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user, jti);
    await addRefreshTokenToWhitelist({ jti, refreshToken: newRefreshToken, userId: user.id });

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    next(err);
  }
});

// This endpoint is only for demo purpose.
// Move this logic where you need to revoke the tokens( for ex, on password reset)
router.post('/revokeRefreshTokens', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body;
    await revokeTokens(userId);
    res.json({ message: `Tokens revoked for user with id #${userId}` });
  } catch (err) {
    next(err);
  }
});

export default router;
