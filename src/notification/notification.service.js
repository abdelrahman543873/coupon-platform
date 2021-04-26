import {
  getNotificationsRepository,
  addTokenRepository,
} from "./notification.repository.js";

export const getNotificationsService = async (req, res, next) => {
  try {
    const notifications = await getNotificationsRepository(
      req.currentUser._id,
      req.query.offset,
      req.query.limit
    );
    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const addeTokenService = async (req, res, next) => {
  try {
    if (req.currentUser) {
      req.currentUser.fcmToken = req.body.fcmToken;
      await req.currentUser.save();
      req.currentUser = req.currentUser.toJSON();
      delete req.currentUser.password;
    }
    const fcmToken = req.currentUser
      ? { user: req.currentUser }
      : await addTokenRepository(req.body);
    res.status(200).json({
      success: true,
      data: fcmToken,
    });
  } catch (error) {
    next(error);
  }
};
