import type {HydratedDocument, Types} from 'mongoose';
import type {Cooldown} from './model';

// Update this if you add a property to the Credit type!
type CooldownResponse = {
  _id: string; // MongoDB assigns each object this ID on creation
  associated_freet: string;
  provocative: Array<Types.ObjectId>;
  views: Array<Types.ObjectId>;
  inflammatory_designation: boolean;
};

/**
 * Transform a raw Credit object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<Credit>} credit - A credit object
 * @returns {CooldownResponse} - The user object without the password
 */
const constructCooldownResponse = (cooldown: HydratedDocument<Cooldown>): CooldownResponse => {
  const cooldownCopy: Cooldown = {
    ...cooldown.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  return {
    _id: cooldownCopy._id.toString(),
    associated_freet: cooldownCopy.associated_freet.toString(),
    provocative: [...cooldownCopy.provocative],
    views: [...cooldownCopy.views],
    inflammatory_designation: cooldownCopy.inflammatory_designation,
  };
};

export {
  constructCooldownResponse,
  CooldownResponse,
};
