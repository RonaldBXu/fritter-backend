import type { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import CooldownCollection from './collection';

/**
 * Checks if the other user exists in the database.
 */
const doesCooldownExist = async (req: Request, res: Response, next: NextFunction) => {
  let cooldown = undefined;
  if (req.params.freetId) {
    cooldown = await CooldownCollection.findOneByFreetId(req.params.freetId);
  }
  if (!cooldown) {
    res.status(404).json({
      error: {
        cooldownNotFound: `Cooldown object with freetId ${req.params.freetId} not found.` 
      }
    });
    return;
  }
  next();
};

export {
  doesCooldownExist,
};
