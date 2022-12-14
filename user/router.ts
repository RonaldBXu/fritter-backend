import type {Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from './collection';
import CreditCollection from '../credit/collection';
import * as userValidator from '../user/middleware';
import * as util from './util';
import * as creditUtil from '../credit/util';

const router = express.Router();

/**
 * Sign in user.
 *
 * @name POST /api/users/session
 *
 * @param {string} username - The user's username
 * @param {string} password - The user's password
 * @return {UserResponse} - An object with user's details
 * @throws {403} - If user is already signed in
 * @throws {400} - If username or password is  not in the correct format,
 *                 or missing in the req
 * @throws {401} - If the user login credentials are invalid
 *
 */
router.post(
  '/session',
  [
    userValidator.isUserLoggedOut,
    userValidator.isValidUsername,
    userValidator.isValidPassword,
    userValidator.isAccountExists
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUsernameAndPassword(
      req.body.username, req.body.password
    );
    req.session.userId = user._id.toString();
    res.status(201).json({
      message: 'You have logged in successfully',
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Sign out a user
 *
 * @name DELETE /api/users/session
 *
 * @return - None
 * @throws {403} - If user is not logged in
 *
 */
router.delete(
  '/session',
  [
    userValidator.isUserLoggedIn
  ],
  (req: Request, res: Response) => {
    req.session.userId = undefined;
    res.status(200).json({
      message: 'You have been logged out successfully.'
    });
  }
);

/**
 * Create a user account.
 *
 * @name POST /api/users
 *
 * @param {string} username - username of user
 * @param {string} password - user's password
 * @return {UserResponse} - The created user
 * @throws {403} - If there is a user already logged in
 * @throws {409} - If username is already taken
 * @throws {400} - If password or username is not in correct format
 *
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedOut,
    userValidator.isValidUsername,
    userValidator.isUsernameNotAlreadyInUse,
    userValidator.isValidPassword
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.addOne(req.body.username, req.body.password);
    const uid = user._id.toString();
    req.session.userId = uid;
    const credit = await CreditCollection.addOne(user._id);
    res.status(201).json({
      message: `Your account was created successfully. You have been logged in as ${user.username}`,
      user: util.constructUserResponse(user),
      credit: creditUtil.constructCreditResponse(credit),
    });
  }
);

/**
 * Update a user's profile.
 *
 * @name PUT /api/users
 *
 * @param {string} username - The user's new username
 * @param {string} password - The user's new password
 * @return {UserResponse} - The updated user
 * @throws {403} - If user is not logged in
 * @throws {409} - If username already taken
 * @throws {400} - If username or password are not of the correct format
 */
router.put(
  '/',
  [
    userValidator.isUserLoggedIn,
    userValidator.isValidUsername,
    userValidator.isUsernameNotAlreadyInUse,
    userValidator.isValidPassword
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const user = await UserCollection.updateOne(userId, req.body);
    res.status(200).json({
      message: 'Your profile was updated successfully.',
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Delete a user.
 *
 * @name DELETE /api/users
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 */
router.delete(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (await UserCollection.findOneByUserId(req.session.userId))._id;
    await UserCollection.deleteOne(userId);
    await FreetCollection.deleteMany(userId);
    await CreditCollection.deleteOne(userId);
    req.session.userId = undefined;
    res.status(200).json({
      message: 'Your account has been deleted successfully.'
    });
  }
);

/**
 * View User
 *
 * @name GET /api/users/:id
 *
 * @return {util.UserResponse} - An object with user info
 * @throws {400} If userId is empty
 * @throws {404} - If no user object with user id id exists
 *
 */
 router.get(
  '/:userId?',
  [
    userValidator.nullUser,
    userValidator.doesUserExist,
  ],
  async (req: Request, res: Response) => {
    const uid = req.params.userId as string;
    const user = await UserCollection.findOneByUserId(uid);
    res.status(200).json({
      message: 'Here is the user object.',
      user: util.constructUserResponse(user),
    });
  }
);

export {router as userRouter};
