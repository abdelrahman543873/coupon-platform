import { getCustomerRepository } from "../customer/customer.repository.js";
import { UserRoleEnum } from "../user/user-role.enum.js";

export const getInfoService = async (req, res, next) => {
  try {
    const user = req.currentUser;
    let data = { user: { ...user.toJSON() } };
    //if user is customer return user and customer data
    user.role === UserRoleEnum[1] &&
      (data = {
        user: {
          ...(await getCustomerRepository(user.id)),
          ...user.toJSON(),
        },
      });
    delete data.user.password;
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
