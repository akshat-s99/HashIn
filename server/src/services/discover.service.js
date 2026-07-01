import mongoose from 'mongoose';
import { User } from '../models/User.model.js';
import { Swipe } from '../models/Swipe.model.js';
import { Connection } from '../models/Connection.model.js';
import { AppError } from '../utils/AppError.js';
import { HTTP_STATUS, SWIPE_ACTION, CONNECTION_STATUS } from '../config/constants.js';

/**
 * Gets a stack of recommended users for the discovery engine.
 * Algorithm (P0):
 * 1. Find all users the current user has already swiped on.
 * 2. Find the current user's skills.
 * 3. Return up to `limit` users who:
 *    - Are NOT the current user
 *    - Are NOT in the "already swiped" list
 *    - Share at least one skill with the current user (if current user has skills)
 */
export const getRecommendations = async (userId, limit = 10) => {
  const currentUser = await User.findById(userId);
  if (!currentUser) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);

  // 1. Get all IDs the user has already swiped on
  const swipes = await Swipe.find({ swiperId: userId }).select('swipedId');
  const swipedUserIds = swipes.map(swipe => swipe.swipedId);

  // Add the current user to the exclusion list
  swipedUserIds.push(currentUser._id);

  // 2. Build the query
  const query = { _id: { $nin: swipedUserIds } };

  // If the user has skills, prioritize matching those skills
  if (currentUser.skills && currentUser.skills.length > 0) {
    query.skills = { $in: currentUser.skills };
  }

  // 3. Execute query
  // For P0, we just limit and return. A more complex aggregation could score them by number of matching skills
  const recommendations = await User.find(query).limit(limit);

  // If we don't have enough skill-based matches, backfill with random users (excluding swiped)
  if (recommendations.length < limit) {
    const recommendationIds = recommendations.map(r => r._id);
    const excludeIds = [...swipedUserIds, ...recommendationIds];
    
    const backfill = await User.find({ _id: { $nin: excludeIds } }).limit(limit - recommendations.length);
    recommendations.push(...backfill);
  }

  return recommendations;
};

/**
 * Records a swipe action and handles mutual matching
 */
export const swipeUser = async (swiperId, swipedId, action) => {
  // 1. Validate swiped user exists
  const swipedUser = await User.findById(swipedId);
  if (!swipedUser) {
    throw new AppError('Target user not found', HTTP_STATUS.NOT_FOUND);
  }

  // 2. Prevent self-swiping
  if (swiperId.toString() === swipedId.toString()) {
    throw new AppError('Cannot swipe on yourself', HTTP_STATUS.BAD_REQUEST);
  }

  // 3. Record the swipe (upsert to handle if they somehow swipe again)
  await Swipe.findOneAndUpdate(
    { swiperId, swipedId },
    { action },
    { upsert: true, new: true }
  );

  let isMatch = false;

  // 4. If this is a LIKE, check for a mutual like
  if (action === SWIPE_ACTION.LIKE) {
    const mutualSwipe = await Swipe.findOne({
      swiperId: swipedId,
      swipedId: swiperId,
      action: SWIPE_ACTION.LIKE,
    });

    if (mutualSwipe) {
      isMatch = true;
      // 5. Create a connection (accepted automatically since it's a mutual match)
      await Connection.findOneAndUpdate(
        { 
          $or: [
            { senderId: swiperId, receiverId: swipedId },
            { senderId: swipedId, receiverId: swiperId }
          ]
        },
        { 
          senderId: swiperId,
          receiverId: swipedId,
          status: CONNECTION_STATUS.ACCEPTED 
        },
        { upsert: true }
      );
    }
  }

  return { isMatch };
};
