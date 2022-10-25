import type { HydratedDocument } from 'mongoose';
import moment from 'moment';
import type { ScheduledFreet } from './model';

// Update this if you add a property to the Freet type!
type ScheduledFreetResponse = {
  _id: string;
  author: string;
  content: string;
  publish_date: Date;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Encode a string as a date
 *
 * @param {string} date - A string representing a date
 * @returns {Date} - a date object represented by date
 */
const formatStringToDate = (date: string): Date => moment(date).toDate();

/**
* see if a date is valid
*
* @param {string} date - A string representing a date
* @returns {boolean} - if this is a valid date
*/
const validDate = (date: string): boolean => {
  
  const testDate = moment(date, "MM-DD-YYYY HH:mm", true)
  return !(testDate == null || !testDate.isValid())
}

/**
* @returns {Date} - Today's date
*/
const today = (): Date => {
  return moment().toDate();
}


/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<ScheduledFreet>} freet - A freet
 * @returns {ScheduledFreetResponse} - The freet object formatted for the frontend
 */
const constructScheduledFreetResponse = (scheduledFreet: HydratedDocument<ScheduledFreet>): ScheduledFreetResponse => {
  const scheduledFreetCopy: ScheduledFreet = {
    ...scheduledFreet.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const obj = {
    _id: scheduledFreetCopy._id.toString(),
    author: scheduledFreetCopy.associated_user.toString(),
    publish_date: scheduledFreetCopy.publish_date,
    content: scheduledFreetCopy.content,
  }
  return obj;
};

export {
  constructScheduledFreetResponse,
  formatDate,
  formatStringToDate,
  validDate,
  today,
  ScheduledFreetResponse,

};
