import { getCustomerRepository } from "../customer/customer.repository.js";
import { findProviderByUserId } from "../provider/provider.repository.js";
import { UserRoleEnum } from "../user/user-role.enum.js";

export const getInfoService = async (req, res, next) => {
  try {
    const user = req.currentUser;
    let data = { user: { ...user.toJSON() } };
    // if user is provider return provider and user data
    user.role === UserRoleEnum[0] &&
      (data = {
        ...(await findProviderByUserId(user._id)),
      });
    //if user is customer return user and customer data
    user.role === UserRoleEnum[1] &&
      (data = {
        ...(await getCustomerRepository(user.id)),
      });
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
