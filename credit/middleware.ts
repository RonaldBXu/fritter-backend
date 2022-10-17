import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import CreditCollection from './collection';

/**
 * Checks if the other user exists in the database.
 */
 const doesOtherUserExist = async (req: Request, res: Response, next: NextFunction) => {
  let user = undefined;
  if (req.body.other_username) {
    user = await UserCollection.findOneByUsername(req.body.other_username);
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
  const other_user = await UserCollection.findOneByUsername(req.body.other_username);
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

export {
  doesOtherUserExist,
  isOtherUserMe,
};
