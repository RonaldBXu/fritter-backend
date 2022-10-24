import type { Request, Response, NextFunction } from 'express';
import FreetCollection from '../freet/collection';
import { Types } from 'mongoose';
import UserCollection from '../user/collection';
import ReflectionCollection from './collection';

/**
 * Checks if the reflection exists in the database.
 */
const doesReflectionExist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let reflection = undefined;
    if (req.params.reflectionId) {
      reflection = await ReflectionCollection.findOneById(req.params.reflectionId);
    }
    if (!reflection) {
      res.status(404).json({
        error: {
          reflectionNotFound: 'Reflection object was not found.'
        }
      });
      return;
    }
  } catch (e) {

    res.status(404).json({
      error: {
        reflectionNotFound: 'Reflection object was not found.'
      }
    });
    return;

  }

  next();
};

/**
 * Checks if the user is a valid modifier of this reflection.
 */
const validModifier = async (req: Request, res: Response, next: NextFunction) => {
  const reflection = await ReflectionCollection.findOneById(req.params.reflectionId);
  if (reflection.associated_user.toString() !== req.session.userId) {
    res.status(403).json({
      error: {
        notValidModifier: 'You cannot modify other users reflections.'
      }
    });
    return;
  }
  next();
};

/**
 * Checks if the user is a valid viewer of these reflections.
 */
const canViewReflections = async (req: Request, res: Response, next: NextFunction) => {
  if (!(req.query.public==='yes') && req.session.userId !== req.query.id) {
    res.status(403).json({
      error: {
        permissionDenied: 'You cannot view other users private reflections.'
      }
    });
    return;
  }
  next();
};

/**
 * Checks if the associated freet is valid.
 */
const isValidAssociatedFreet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let freet = undefined;
    if (req.body.id) {
      freet = await FreetCollection.findOne(req.body.id);
    }
    if (!freet) {
      res.status(404).json({
        error: {
          freetNotFound: 'Freet object was not found.'
        }
      });
      return;
    }
  } catch (e) {
    res.status(404).json({
      error: {
        freetNotFound: 'Freet object was not found.'
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidReflectionContent = (req: Request, res: Response, next: NextFunction) => {
  const content = req.body.content;
  if (!content.trim()) {
    res.status(400).json({
      error: 'Freet content must be at least one character long.'
    });
    return;
  }

  next();
};

/**
 * Checks if a user object with user id id exists
 */
const doesUserExist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let user = undefined;
    if (req.query.id) {
      user = await UserCollection.findOneByUserId(req.query.id as string);
    }
    if (!user) {
      res.status(404).json({
        error: {
          userNotFound: 'user object was not found.'
        }
      });
      return;
    }
  } catch {
    res.status(404).json({
      error: {
        userNotFound: 'user object was not found.'
      }
    });
    return;
  }

  next();
};

/**
 * Checks for null input for get request
 */
const nullGet = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.id || !req.query.public) {
    res.status(400).json({
      error: {
        nullInput: 'cannot have empty userId or public'
      }
    });
    return;
  }
  next();
};

/**
 * Checks for null input for reflectionId
 */
const nullRefId = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.reflectionId || !req.body.public) {
    res.status(400).json({
      error: {
        nullInput: 'cannot have empty reflectionId or public'
      }
    });
    return;
  }
  next();
};



export {
  doesReflectionExist,
  validModifier,
  isValidAssociatedFreet,
  isValidReflectionContent,
  canViewReflections,
  doesUserExist,
  nullGet,
  nullRefId,
};
