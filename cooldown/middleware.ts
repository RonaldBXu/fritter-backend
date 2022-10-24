import type { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import CooldownCollection from './collection';

/**
 * Checks if the cooldown exists in the database.
 */
const doesCooldownExist = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
  } catch (e) {
    res.status(404).json({
      error: {
        cooldownNotFound: `Cooldown object with freetId ${req.params.freetId} not found.`
      }
    });
    return;
  }

  next();
};

const nullFreet = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.freetId) {
    res.status(400).json({
      error: 'Provided freetId must be nonempty.'
    });
    return;
  }
  next();
}

export {
  doesCooldownExist,
  nullFreet
};
