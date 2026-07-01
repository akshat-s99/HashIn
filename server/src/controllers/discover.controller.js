import * as discoverService from '../services/discover.service.js';
import { sendSuccess } from '../utils/apiResponse.utils.js';
import { HTTP_STATUS } from '../config/constants.js';

export const getRecommendations = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const recommendations = await discoverService.getRecommendations(req.user._id, limit);
    
    sendSuccess(res, HTTP_STATUS.OK, { recommendations });
  } catch (error) {
    next(error);
  }
};

export const swipe = async (req, res, next) => {
  try {
    const { swipedId, action } = req.body;
    const { isMatch } = await discoverService.swipeUser(req.user._id, swipedId, action);
    
    const message = isMatch ? 'It is a mutual match!' : `Successfully swiped ${action}`;
    sendSuccess(res, HTTP_STATUS.OK, { isMatch }, message);
  } catch (error) {
    next(error);
  }
};
