import type { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import UserCollection from '../user/collection';
import CreditCollection from './collection';

/**
 * Checks if the other user exists in the database.
 */
const doesOtherUserExist = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.otherUserId) {
    res.status(400).json({
      error: {
        nullUserId: 'Other User id cannot be blank.'
      }
    });
    return;
  }
  let user = undefined;
  if (req.params.otherUserId) {
    user = await UserCollection.findOneByUsername(req.params.otherUserId);
  }
  if (!user) {
    res.status(404).json({
      error: {
        userNotFound: 'Other User object was not found.'
      }
    });
    return;
  }
  next();
};

/**
 * Makes sure that the other user is not yourself.
 */
const isOtherUserMe = async (req: Request, res: Response, next: NextFunction) => {
  const other_user = await UserCollection.findOneByUsername(req.params.otherUserId);
  if (other_user._id.toString() === req.session.userId) {
    res.status(412).json({
      error: {
        sameUser: 'You cannot give/take credit from yourself.'
      }
    });
    return;
  }
  next();
};

/**
 * Checks if a credit object with associated user id id exists
 */
const doesCreditExist = async (req: Request, res: Response, next: NextFunction) => {
  let user = undefined;
  if (req.params.userId) {
    user = await CreditCollection.findOneByUserId(req.params.userId);
  }
  if (!user) {
    res.status(404).json({
      error: {
        creditNotFound: 'Credit object was not found.'
      }
    });
    return;
  }
  next();
};

/**
 * Checks if the other user exists in the database.
 */
const doesIdExist = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.userId) {
    res.status(400).json({
      error: {
        nullUserId: 'User id cannot be blank.'
      }
    });
    return;
  }
  next();
}
export {
  doesOtherUserExist,
  isOtherUserMe,
  doesIdExist,
  doesCreditExist,
};
