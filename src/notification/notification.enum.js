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
    user: NotifiedEnum[1],
    enTitle: `new provider ${provider.name} 🥳🥳 `,
    arTitle: `مقدم خدمه جديد 🥳🥳 ${provider.name}`,
    enBody: `A new provider  ${provider.name} has just joined coupons`,
    arBody: `${provider.name}الي كوبونات انضم`,
    action: "view_provider",
    data: provider._id,
  };
};

export const NewAdminProviderMessage = (provider) => {
  return {
    user: NotifiedEnum[2],
    enTitle: `new provider ${provider.name} 🥳🥳 `,
    arTitle: `مقدم خدمه جديد 🥳🥳 ${provider.name}`,
    enBody: `A new provider  ${provider.name} has just joined coupons`,
    arBody: `${provider.name} الي كوبونات انضم`,
    action: "view_provider",
    data: provider._id,
  };
};

export const NewCustomerMessage = (arMessage, enMessage, subscription) => {
  return {
    user: NotifiedEnum[6],
    arTitle: arMessage,
    enTitle: enMessage,
    enBody: enMessage,
    arBody: arMessage,
    action: "view_rejection",
    data: subscription,
  };
};

export const NewSubscriptionMessage = (customer, coupon, subscription) => {
  return {
    user: NotifiedEnum[5],
    enTitle: `new subscription from ${customer.name} 🥳🥳 `,
    arTitle: `اشتراك جديد من 🥳🥳 ${customer.name}`,
    enBody: `A new customer  ${customer.name} has just subscribed to your coupon ${coupon.enName}`,
    arBody: `${coupon.arName} في كوبونك ${customer.name} اشترك`,
    action: "view_subscription",
    data: subscription._id,
  };
};

export const NotifiedEnum = [
  "PROVIDERS",
  "CUSTOMERS",
  "ADMINS",
  "ALL",
  "CUSTOMERS&ADMINS",
  "ADMINS&PROVIDER",
  "CUSTOMER",
];
