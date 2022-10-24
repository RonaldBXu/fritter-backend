import type {Request, Response} from 'express';
import express from 'express';
import ReflectionCollection from './collection';
import * as userValidator from '../user/middleware';
import * as reflectionValidator from './middleware'
import * as util from './util';

const router = express.Router();

/**
 * View reflections
 *
 * @name GET /api/reflections?id=userId&public=public
 *
 * @return {Array<util.ReflectionResponse>} - An object with reflections
 * @throws {400} - If id or public are empty
 * @throws {403} - If the user is not logged in or if the user cannot view this reflection.
 * @throws {404} - If the user is not found.
 * 
 */
 router.get(
  '/',
  [
    reflectionValidator.nullGet,
    userValidator.isUserLoggedIn,
    reflectionValidator.doesUserExist,
    reflectionValidator.canViewReflections,
  ],
  async (req: Request, res: Response) => {
    const uid = req.query.id as string;
    const reflection = await ReflectionCollection.getUserReflections(uid, req.query.public==='yes');
    const ans = [];
    for (const ref of reflection){
      ans.push(util.constructReflectionResponse(ref));
    }
    res.status(200).json({
      message: 'Here are the reflection objects.',
      reflection: ans,
    });
  }
);

/**
 * Edit a reflection
 *
 * @name PUT /api/reflections/:reflectionId?
 *
 * @return {util.ReflectionResponse} - An object with updated reflection
 * @throws {400} - If reflectionId is empty
 * @throws {403} - If no user is logged in or if this reflection is not associated with the logged in user
 * @throws {404} - If the reflection is not found.
 * 
 */
 router.put(
  '/:reflectionId?',
  [
    reflectionValidator.nullRefId,
    userValidator.isUserLoggedIn,
    reflectionValidator.doesReflectionExist,
    reflectionValidator.validModifier,
  ],
  async (req: Request, res: Response) => {
    const reflection = await ReflectionCollection.updateReflection(req.params.reflectionId, req.body.public==='yes');
    res.status(200).json({
      message: 'reflection updated successfully.',
      reflection: util.constructReflectionResponse(reflection),
    });
  }
);

/**
 * Create a new reflection.
 *
 * @name POST /api/reflections
 *
 * @param {string} content - The content of the reflection
 * @param {string} id - the id of the associated freet
 * @return {util.ReflectionResponse} - The created reflection
 * @throws {400} - If the reflection content is empty or a stream of empty spaces
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the associated freet is not found
 */
 router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    reflectionValidator.isValidAssociatedFreet,
    reflectionValidator.isValidReflectionContent,
  ],
  async (req: Request, res: Response) => {
    const reflection = await ReflectionCollection.addOne(req.session.userId, req.body.id, req.body.content);
    res.status(201).json({
      message: 'Your reflection was created successfully.',
      reflection: util.constructReflectionResponse(reflection)
    });
    return;

  }
);

export {router as reflectionRouter};
