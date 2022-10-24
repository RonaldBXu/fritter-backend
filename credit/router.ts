import type {Request, Response} from 'express';
import express from 'express';
import CreditCollection from './collection';
import * as creditValidator from './middleware';
import * as userValidator from '../user/middleware';
import * as util from './util';

const router = express.Router();

/**
 * View Credit
 *
 * @name GET /api/credits/:id
 *
 * @return {util.CreditResponse} - An object with your credit
 * @throws {400} - If userId is empty
 * @throws {404} - If no credit object with associated user id id exists
 *
 */
 router.get(
  '/:userId?',
  [
    creditValidator.doesIdExist,
    creditValidator.doesCreditExist,
  ],
  async (req: Request, res: Response) => {
    const uid = req.params.userId as string;
    const credit = await CreditCollection.findOneByUserId(uid);
    res.status(200).json({
      message: 'Here is the credit object.',
      credit: util.constructCreditResponse(credit),
    });
  }
);

/**
 * Give or take away credit.
 *
 * @name PUT /api/credits/:other_username
 *
 * @return {credit: util.CreditResponse, otherCredit: util.CreditResponse} - An object with updated credit and otherCredit objects
 * @throws {400} - If other_username is empty
 * @throws {403} - If no user is logged in
 * @throws {404} - If user who is giving/removing credit or user whose credit is changing is not found
 * @throws {412} - If user who is giving/removing credit the same as the user whose credit is changing
 *
 */
 router.put(
  '/:otherUserId?',
  [
    userValidator.isUserLoggedIn,
    creditValidator.doesOtherUserExist,
    creditValidator.isOtherUserMe,
  ],
  async (req: Request, res: Response) => {
    const uid = (await CreditCollection.findOneByUserId(req.session.userId)).associated_user;
    const other_uid = (await CreditCollection.findOneByUsername(req.params.otherUserId)).associated_user;
    const twoCreditObj = await CreditCollection.updateCreditScore(uid, other_uid);
    res.status(200).json({
      message: 'Credit updated successfully.',
      credit: util.constructCreditResponse(twoCreditObj.credit),
      otherCredit: util.constructCreditResponse(twoCreditObj.otherCredit)
    });
  }
);

export {router as creditRouter};
