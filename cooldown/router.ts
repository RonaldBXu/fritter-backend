import type {Request, Response} from 'express';
import express from 'express';
import CooldownCollection from './collection';
import * as cooldownValidator from './middleware';
import * as userValidator from '../user/middleware';
import * as util from './util';

const router = express.Router();

/**
 * View Cooldown of a freet
 *
 * @name GET /api/cooldowns/:freetId?
 *
 * @return {util.CooldownResponse} - An object with your credit
 * @throws {404} - If no cooldown object with associated freet id freetId exists
 *
 */
 router.get(
  '/:freetId?',
  [
    cooldownValidator.doesCooldownExist,
  ],
  async (req: Request, res: Response) => {
    const fid = req.params.freetId as string;
    const cooldown = await CooldownCollection.findOneByFreetId(fid);
    res.status(200).json({
      message: 'Here is the cooldown object.',
      cooldown: util.constructCooldownResponse(cooldown),
    });
  }
);

/**
 * Modify a cooldown object
 *
 * @name PUT /api/cooldowns/:freetId?
 *
 * @return {Cooldown: util.CooldownResponse} - An object with updated cooldown objects
 * @throws {403} - If no user is logged in
 * @throws {404} - If the freet is not found
 * 
 */
 router.put(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    cooldownValidator.doesCooldownExist,
  ],
  async (req: Request, res: Response) => {
    const prov = (req.body.provocative === 'yes');
    const cooldown = await CooldownCollection.updateCooldown(req.session.userId, req.body.freet_id, prov)
    res.status(200).json({
      message: 'Cooldown updated successfully.',
      cooldown: util.constructCooldownResponse(cooldown),
    });
  }
);

export {router as cooldownRouter};
