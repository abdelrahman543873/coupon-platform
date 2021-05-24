export const logoutService = async (req, res, next) => {
  try {
    const user = req.currentUser;
    user.fcmToken = "";
    await user.save();
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
