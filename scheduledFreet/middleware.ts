import type { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import ScheduledFreetCollection from './collection';
import * as util from './util'

/**
 * Checks if a freet with scheduledFreetId in req.params exists
 */
const isScheduledFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  const scheduledFreet = await ScheduledFreetCollection.findOne(req.params.freetId);
  if (!scheduledFreet) {
    res.status(404).json({
      error: {
        scheduledFreetNotFound: `ScheduledFreet with freet ID ${req.params.freetId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidScheduledFreetContent = (req: Request, res: Response, next: NextFunction) => {
  const { content } = req.body as { content: string };
  if (!content.trim()) {
    res.status(400).json({
      error: 'Scheduled Freet content must be at least one character long.'
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: 'Scheduled Freet content must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
const isValidScheduledFreetModifier = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await ScheduledFreetCollection.findOne(req.params.freetId);
  const userId = freet.associated_user;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' freets.'
    });
    return;
  }

  next();
};

/**
 * Checks if the publish_date is valid in req.params
 */
const isValidDate = async (req: Request, res: Response, next: NextFunction) => {
  // I will not check whether the date itself is in a valid format. 
  // The frontend can handle that. I will give users a calendar so they cannot enter the date wrong.
  const date = util.formatStringToDate(req.body.publish_date);
  const currDate = util.today();
  if (date.getTime() <= currDate.getTime()) {
    res.status(412).json({
      error: 'Publish date is in the past.'
    });
    return;
  }
  next();
};

export {
  isValidScheduledFreetContent,
  isScheduledFreetExists,
  isValidScheduledFreetModifier,
  isValidDate
};
