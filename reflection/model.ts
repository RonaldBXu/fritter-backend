import {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a User
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for User on the backend
export type Reflection = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  associated_freet: Types.ObjectId;
  associated_user: Types.ObjectId;
  public: boolean;
  reflection_content: string;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Reflections stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ReflectionSchema = new Schema<Reflection>({
  // The freet's id
  associated_freet: {
    type: Schema.Types.ObjectId,
    required: true
  },
  // The user's password
  associated_user: {
    type: Schema.Types.ObjectId,
    required: true
  },
  public: {
    type: Boolean,
    required: true
  },
  reflection_content: {
    type: String,
    required: true
  }
});

const ReflectionModel = model<Reflection>('Reflection', ReflectionSchema);
export default ReflectionModel;
