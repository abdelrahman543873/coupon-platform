export const NewCouponMessage = (coupon, provider) => {
  return {
    user: NotifiedEnum[4],
    enTitle: `new Coupon🥳🥳 ${coupon.enName}`,
    arTitle: `كوبون خصم جديد 🥳🥳 ${coupon.arName}`,
    enBody: `new Coupon from ${provider.name}`,
    arBody: `${provider.name}كوبون خصم جديد من`,
    action: "view_coupon",
    data: coupon._id,
  };
};

export const NewProviderMessage = (provider) => {
  return {
    user: NotifiedEnum[4],
    enTitle: `new provider ${provider.name} 🥳🥳 `,
    arTitle: `مقدم خدمه جديد 🥳🥳 ${provider.name}`,
    enBody: `A new provider  ${provider.name} has just joined coupons`,
    arBody: `الي كوبونات${provider.name} انضم`,
    action: "view_provider",
    data: provider._id,
  };
};

export const NewSubscriptionMessage = (customer, coupon) => {
  return {
    user: NotifiedEnum[5],
    enTitle: `new subscription from ${customer.name} 🥳🥳 `,
    arTitle: `اشتراك جديد من 🥳🥳 ${customer.name}`,
    enBody: `A new customer  ${customer.name} has just subscribed to your coupon ${coupon.enName}`,
    arBody: `${coupon.arName} في كوبونك ${customer.name} اشترك`,
    action: "view_coupon",
    data: coupon._id,
  };
};

export const NotifiedEnum = [
  "PROVIDERS",
  "CUSTOMERS",
  "ADMINS",
  "ALL",
  "CUSTOMERS&ADMINS",
  "ADMINS&PROVIDERS",
];
