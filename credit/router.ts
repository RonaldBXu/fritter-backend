import type {Request, Response} from 'express';
import express from 'express';
import CreditCollection from './collection';
import * as creditValidator from './middleware';
import * as userValidator from '../user/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Give or take away credit.
 *
 * @name GET /api/credits
 *
 * @return {util.CreditResponse} - An object with your credit
 * @throws {403} - If no user is logged in
 *
 */
 router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const uid = req.session.userId as string;
    const credit = await CreditCollection.findOneByUserId(uid);
    res.status(200).json({
      message: 'Here is your credit.',
      credit: util.constructCreditResponse(credit),
    });
  }
);

/**
 * Give or take away credit.
 *
 * @name PUT /api/credits
 *
 * @param {string} other_username - The username of the user whose credit is being changed
 * @return {credit: util.CreditResponse, otherCredit: util.CreditResponse} - An object with updated credit and otherCredit objects
 * @throws {403} - If no user is logged in
 * @throws {404} - If user who is giving/removing credit or user whose credit is changing is not found
 * @throws {412} - If user who is giving/removing credit the same as the user whose credit is changing
 *
 */
 router.put(
  '/',
  [
    userValidator.isUserLoggedIn,
    creditValidator.doesOtherUserExist,
    creditValidator.isOtherUserMe,
  ],
  async (req: Request, res: Response) => {
    const uid = req.session.userId as string;
    const other_uid = (await CreditCollection.findOneByUsername(req.body.other_username)).associated_user;
    const twoCreditObj = await CreditCollection.updateCreditScore(uid, other_uid);
    res.status(200).json({
      message: 'Credit updated successfully.',
      credit: util.constructCreditResponse(twoCreditObj.credit),
      otherCredit: util.constructCreditResponse(twoCreditObj.otherCredit)
    });
  }
);

export {router as creditRouter};
