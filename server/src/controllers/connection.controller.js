import * as connectionService from '../services/connection.service.js';
import { sendSuccess } from '../utils/apiResponse.utils.js';
import { HTTP_STATUS } from '../config/constants.js';

export const requestConnection = async (req, res, next) => {
  try {
    const connection = await connectionService.sendConnectionRequest(req.user._id, req.params.userId);
    sendSuccess(res, HTTP_STATUS.CREATED, { connection }, 'Connection request sent');
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const connection = await connectionService.updateConnectionStatus(req.user._id, req.params.connectionId, req.body.status);
    sendSuccess(res, HTTP_STATUS.OK, { connection }, `Connection ${req.body.status}`);
  } catch (error) {
    next(error);
  }
};

export const getConnections = async (req, res, next) => {
  try {
    const { status } = req.query; // 'pending' or 'accepted'
    const connections = await connectionService.getUserConnections(req.user._id, status);
    sendSuccess(res, HTTP_STATUS.OK, { connections });
  } catch (error) {
    next(error);
  }
};

export const removeConnection = async (req, res, next) => {
  try {
    await connectionService.removeConnection(req.user._id, req.params.connectionId);
    sendSuccess(res, HTTP_STATUS.OK, null, 'Connection removed');
  } catch (error) {
    next(error);
  }
};
