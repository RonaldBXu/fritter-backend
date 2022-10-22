import {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a User
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for User on the backend
export type Credit = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  associated_user: Types.ObjectId;
  credit: number;
  credit_given: Array<Types.ObjectId>;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Credit Scores stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const CreditSchema = new Schema<Credit>({
  // The user's username
  associated_user: {
    type: Schema.Types.ObjectId,
    required: true
  },
  // The user's password
  credit: {
    type: Number,
    required: true
  },
  // The date the user joined
  credit_given: {
    type: [Schema.Types.ObjectId],
    required: true
  }
});

const CreditModel = model<Credit>('Credit', CreditSchema);
export default CreditModel;
