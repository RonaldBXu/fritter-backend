import type { HydratedDocument, Types } from 'mongoose';
import UserCollection from '../user/collection';
import type { ScheduledFreet } from './model';
import ScheduledFreetModel from './model';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class ScheduledFreetCollection {

  /**
   * Add a freet to the collection
   *
   * @param {string} associated_user - The id of the author of the freet
   * @param {string} content - The id of the content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   */
  static async addOne(associated_user: Types.ObjectId, content: string, publish_date: Date): Promise<HydratedDocument<ScheduledFreet>> {
    const scheduledFreet = new ScheduledFreetModel({ associated_user: associated_user, content: content, publish_date: publish_date });
    await scheduledFreet.save(); // Saves freet to MongoDB
    return scheduledFreet;
  }

  /**
   * Find a freet by scheduledFreetId
   *
   * @param {string} scheduledFreetId - The id of the scheduled freet to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given scheduledFreetId, if any
   */
  static async findOne(scheduledFreetId: string): Promise<HydratedDocument<ScheduledFreet>> {
    return ScheduledFreetModel.findOne({ _id: scheduledFreetId });
  }

  /**
   * Get all the scheduled freets in the database
   *
   * @return {Promise<HydratedDocument<ScheduledFreet>[]>} - An array of all of the freets
   */
  static async findAll(): Promise<Array<HydratedDocument<ScheduledFreet>>> {
    // Retrieves freets and sorts them from most to least recent
    return ScheduledFreetModel.find({}).sort({ publish_date: -1 });
  }

  /**
   * Get all the freets in by given author
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<ScheduledFreet>>> {
    const author = await UserCollection.findOneByUsername(username);
    return ScheduledFreetModel.find({ associated_user: author._id });
  }

  /**
   * Get all the freets in by given user id
   *
   * @param {string} userId - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByUserId(userId: Types.ObjectId): Promise<Array<HydratedDocument<ScheduledFreet>>> {
    return ScheduledFreetModel.find({ associated_user: userId });
  }

  /**
   * Update a freet with the new content
   *
   * @param {string} scheduledFreetId - The id of the scheduled freet to be updated
   * @param {string} content - The new content of the scheduled freet
   * @param {Date} publish_date - the new publish date of the scheduled freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async updateOne(scheduledFreetId: Types.ObjectId | string, content: string, publish_date: Date): Promise<HydratedDocument<ScheduledFreet>> {
    const scheduledFreet = await ScheduledFreetModel.findOne({ _id: scheduledFreetId });
    scheduledFreet.content = content;
    scheduledFreet.publish_date = publish_date;
    await scheduledFreet.save();
    return scheduledFreet;
  }

  /**
   * Delete a freet with given freetId.
   *
   * @param {string} scheduledFreetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(scheduledFreetId: Types.ObjectId): Promise<boolean> {
    const freet = await ScheduledFreetModel.deleteOne({ _id: scheduledFreetId });
    return freet !== null;
  }

  /**
   * Delete all the freets by the given author
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteMany(authorId: Types.ObjectId): Promise<void> {
    await ScheduledFreetModel.deleteMany({ associated_user: authorId });
  }

}

export default ScheduledFreetCollection;
