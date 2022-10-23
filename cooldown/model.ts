import {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a User
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for User on the backend
export type Cooldown = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  associated_freet: Types.ObjectId;
  provocative: Array<Types.ObjectId>;
  views: Array<Types.ObjectId>;
  inflammatory_designation: boolean;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Cooldowns stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const CooldownSchema = new Schema<Cooldown>({
  // The freet's id
  associated_freet: {
    type: Schema.Types.ObjectId,
    required: true
  },
  // The user's password
  provocative: {
    type: [Schema.Types.ObjectId],
    required: true
  },
  // The date the user joined
  views: {
    type: [Schema.Types.ObjectId],
    required: true
  },
  inflammatory_designation:{
    type: Boolean,
    required: true,
  }
});

const CooldownModel = model<Cooldown>('Cooldown', CooldownSchema);
export default CooldownModel;
