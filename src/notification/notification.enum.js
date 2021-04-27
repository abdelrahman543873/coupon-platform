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

export const NotifiedEnum = [
  "PROVIDERS",
  "CUSTOMERS",
  "ADMINS",
  "ALL",
  "CUSTOMERS&ADMINS",
];
