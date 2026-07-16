import { Notification } from '../models/Notification.model.js';
import { sendSuccess } from '../utils/apiResponse.utils.js';
import { HTTP_STATUS } from '../config/constants.js';

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'firstName lastName avatar headline')
      .sort({ createdAt: -1 })
      .limit(50);
      
    sendSuccess(res, HTTP_STATUS.OK, { notifications });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { $set: { read: true } }
    );
    sendSuccess(res, HTTP_STATUS.OK, { message: 'Notifications marked as read' });
  } catch (error) {
    next(error);
  }
};
