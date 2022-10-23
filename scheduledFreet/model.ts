import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';

/**
 * This file defines the properties stored in a Scheduled Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type ScheduledFreet = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  associated_user: Types.ObjectId;
  content: string;
  publish_date: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// ScheduledFreets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ScheduledFreetSchema = new Schema<ScheduledFreet>({
  // The author userId
  associated_user: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
  },
  // The content of the freet
  content: {
    type: String,
    required: true
  },
  // The content of the freet
  publish_date: {
    type: Date,
    required: true
  },
});

const ScheduledFreetModel = model<ScheduledFreet>('ScheduledFreet', ScheduledFreetSchema);
export default ScheduledFreetModel;
