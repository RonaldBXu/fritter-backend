import CreditCollection from 'credit/collection';
import FreetCollection from 'freet/collection';
import type { HydratedDocument, Types } from 'mongoose';
import type { Cooldown } from './model';
import CooldownModel from './model';

/**
 * This file contains a class with functionality to interact with cooldowns stored
 * in MongoDB, including creating and updating. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<Cooldown> is the output of the CooldownModel() constructor,
 * and contains all the information in Cooldown. https://mongoosejs.com/docs/typescript.html
 */
class CooldownCollection {
  /**
   * Add a new cooldown
   *
   * @param {Types.ObjectId} fid - The freet id of the user
   * @return {Promise<HydratedDocument<Credit>>} - The newly created cooldown
   */
  static async addOne(fid: Types.ObjectId): Promise<HydratedDocument<Cooldown>> {
    const cooldown = new CooldownModel({ associated_freet: fid, provocative: [], views: [] });
    await cooldown.save(); // Saves user to MongoDB
    return cooldown;
  }

  /**
   * Delete cooldown
   *
   * @param {Types.ObjectId} fid - The freet id associated with the cooldown
   * @return {Promise<Boolean>} - true if the cooldown has been deleted, false otherwise
   */
  static async deleteOne(fid: Types.ObjectId): Promise<boolean> {
    const credit = await CooldownModel.deleteOne({ associated_freet: fid });
    return credit !== null;
  }

  /**
    * Find a cooldown by freetId.
    *
    * @param {string} freetId - The user id of the user of the credit to find
    * @return {Promise<Credit> | Promise<null>} - The user id of the credit with the given username, if any
    */
  static async findOneByFreetId(freetId: string): Promise<HydratedDocument<Cooldown>> {
    return CooldownModel.findOne({ associated_freet: freetId });
  }

  /**
   * Update cooldown object
   *
   * @param {string} uid - The user id of the user viewing the associated freet
   * @param {string} fid - The associated freet id of the freet being viewed
   * @param {boolean} provocative - If this user marked the freet as provocative or not.
   * @return {Promise<HydratedDocument<Cooldown>>} - The updated cooldown
   */
  static async updateCooldown(uid: Types.ObjectId, fid: Types.ObjectId, provocative: boolean): Promise<HydratedDocument<Cooldown>> {
    const cooldown = await CooldownModel.findOne({ associated_freet: fid });
    if (!cooldown.views.includes(uid)) cooldown.views.push(uid);
    if (provocative && !cooldown.provocative.includes(uid)) cooldown.provocative.push(uid);
    const numViews = cooldown.views.length + 1;
    const numProv = provocative ? cooldown.provocative.length + 1 : cooldown.provocative.length;
    const provRatio = numProv/numViews;
    if (!cooldown.inflammatory_designation && cooldown.views.length > 50 && provRatio > 0.5){
      cooldown.inflammatory_designation = true;
      await CreditCollection.updateInflam((await FreetCollection.findOne(fid)).authorId);
    } else if (cooldown.inflammatory_designation && cooldown.views.length > 50 && provRatio <= 0.5){
      cooldown.inflammatory_designation = false;
      await CreditCollection.updateNotInflam((await FreetCollection.findOne(fid)).authorId);
    }
    cooldown.save()
    return cooldown;
  }
}

export default CooldownCollection;
