import type {HydratedDocument} from 'mongoose';
import type {Credit} from './model';

// Update this if you add a property to the Credit type!
type CreditResponse = {
  _id: string;
  associated_user: string;
  credit: number;
  credit_given: Array<string>;
};

/**
 * Transform a raw Credit object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<Credit>} credit - A credit object
 * @returns {UserResponse} - The user object without the password
 */
const constructCreditResponse = (credit: HydratedDocument<Credit>): CreditResponse => {
  const creditCopy: Credit = {
    ...credit.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  return {
    _id: creditCopy._id.toString(),
    associated_user: creditCopy.associated_user,
    credit: creditCopy.credit,
    credit_given: creditCopy.credit_given,
  };
};

export {
  constructCreditResponse,
  CreditResponse,
};
