import type { HydratedDocument, Types } from 'mongoose';
import UserCollection from '../user/collection';
import type { Credit } from './model';
import CreditModel from './model';

/**
 * This file contains a class with functionality to interact with credits stored
 * in MongoDB, including creating and updating. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<Credit> is the output of the CreditModel() constructor,
 * and contains all the information in Credit. https://mongoosejs.com/docs/typescript.html
 */
class CreditCollection {
  /**
   * Add a new credit
   *
   * @param {string} uid - The user id of the user
   * @return {Promise<HydratedDocument<Credit>>} - The newly created Credit
   */
  static async addOne(uid: string): Promise<HydratedDocument<Credit>> {
    const credit = new CreditModel({ associated_user: uid, credit: 0, credit_given: [] });
    await credit.save(); // Saves user to MongoDB
    return credit;
  }

  /**
   * Delete credit
   *
   * @param {string} uid - The user id associated with the credit
   * @return {Promise<Boolean>} - true if the credit has been deleted, false otherwise
   */
  static async deleteOne(uid: string): Promise<boolean> {
    const credit = await CreditModel.deleteOne({ associated_user: uid });
    return credit !== null;
  }

  /**
   * Find a credit by username.
   *
   * @param {string} username - The username of the user of the credit to find
   * @return {Promise<Credit> | Promise<null>} - The user id of the credit with the given username, if any
   */
  static async findOneByUsername(username: string): Promise<HydratedDocument<Credit>> {
    const user = await UserCollection.findOneByUsername(username)
    return CreditModel.findOne({ associated_user: user._id });
  }

  /**
    * Update credit score because a post was marked as inflammatory
    *
    * @param {string} uid - The associated user id of the credit to update
    * @return {Promise<HydratedDocument<Credit>>} - The updated credit
    */
  static async updateInflam(uid: string): Promise<HydratedDocument<Credit>> {
    const credit = await CreditModel.findOne({ associated_user: uid });
    credit.credit = (credit.credit as number) * 0.9;
    await credit.save();
    return credit;
  }

  /**
    * Update credit score because a post's inflammatory designation was removed
    *
    * @param {string} uid - The associated user id of the credit to update
    * @return {Promise<HydratedDocument<Credit>>} - The updated credit
    */
  static async updateNotInflam(creditId: string): Promise<HydratedDocument<Credit>> {
    const credit = await CreditModel.findOne({ associated_user: creditId });
    credit.credit = (credit.credit as number) * 1.11;
    await credit.save();
    return credit;
  }

  /**
   * Update credit score
   *
   * @param {string} uid - The associated user id of the user giving/removing credit
   * @param {string} other_uid - The associated user id of the person whose credit is being changed
   * @return {Promise<HydratedDocument<Credit>>} - The updated credit
   */
  static async updateCreditScore(uid: string, other_uid: string): Promise<{ credit: HydratedDocument<Credit>, otherCredit: HydratedDocument<Credit> }> {
    const credit = await CreditModel.findOne({ associated_user: uid });
    const otherCredit = await CreditModel.findOne({ associated_user: other_uid });
    if (credit.credit_given.includes(other_uid)) {
      const ind = credit.credit_given.indexOf(other_uid);
      credit.credit_given.splice(ind, 1);
      //credit.credit_given.delete(other_uid);
      otherCredit.credit = (otherCredit.credit as number) - 1;
    } else {
      //credit.credit_given.add(other_uid)
      credit.credit_given.push(other_uid)
      otherCredit.credit = (otherCredit.credit as number) + 1;
    }
    await credit.save();
    await otherCredit.save();
    return {
      credit: credit,
      otherCredit: otherCredit,
    };
  }
}

export default CreditCollection;
