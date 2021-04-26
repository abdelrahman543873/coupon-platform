import { getNotificationsRepository } from "./notification.repository.js";
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
