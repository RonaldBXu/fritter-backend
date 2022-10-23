import type { HydratedDocument, Types } from 'mongoose';
import type { Reflection } from './model';
import ReflectionModel from './model';

/**
 * This file contains a class with functionality to interact with reflections stored
 * in MongoDB, including creating and updating. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<Reflection> is the output of the ReflectionModel() constructor,
 * and contains all the information in Reflection. https://mongoosejs.com/docs/typescript.html
 */
class ReflectionCollection {
  /**
   * Add a new reflection
   *
   * @param {Types.ObjectId} uid - The user id of the associated user
   * @param {Types.ObjectId} fid - The freet id of the associated freet
   * @param {string} content - The content of the reflection
   * @return {Promise<HydratedDocument<Reflection>>} - The newly created Credit
   */
  static async addOne(uid: Types.ObjectId, fid: Types.ObjectId, content: string): Promise<HydratedDocument<Reflection>> {
    const reflection = new ReflectionModel({ associated_user: uid, associated_freet: fid, reflection_content: content, public: true });
    await reflection.save(); // Saves user to MongoDB
    return reflection;
  }

  /**
    * Find a reflection by reflectionId.
    *
    * @param {string} reflectionId - The reflection id of the reflection to find
    * @return {Promise<Reflection> | Promise<null>} - The the reflection object, if any
    */
  static async findOneById(reflectionId: string): Promise<HydratedDocument<Reflection>> {
    return ReflectionModel.findOne({ _id: reflectionId });
  }

  /**
   * Get reflections.
   *
   * @param {string} uid - The username of the user of the credit to find
   * @param {boolean} pub - true iff we are querying for public reflections
   * @return {Promise<Credit> | Promise<null>} - The user id of the credit with the given username, if any
   */
  static async getUserReflections(uid: string, pub: boolean): Promise<Array<HydratedDocument<Reflection>>> {
    return ReflectionModel.find({ associated_user: uid, public: pub });
  }

  /**
    * Update reflection
    *
    * @param {string} rid - The reflection id of the reflection to update
    * @param {boolean} pub - true iff we want to set this reflection to public
    * @return {Promise<HydratedDocument<Credit>>} - The updated credit
    */
  static async updateReflection(rid: string, pub: boolean): Promise<HydratedDocument<Reflection>> {
    const reflection = await ReflectionModel.findOne({ _id: rid });
    reflection.public = pub;
    await reflection.save();
    return reflection;
  }

}

export default ReflectionCollection;
