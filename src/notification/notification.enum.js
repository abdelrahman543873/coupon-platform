export const NewCouponMessage = (coupon, provider) => {
  return {
    enTitle: `new Coupon🥳🥳 ${coupon.enName}`,
    arTitle: `كوبون خصم جديد 🥳🥳 ${coupon.arName}`,
    enBody: `new Coupon from ${provider.name}`,
    arBody: `${provider.name}كوبون خصم جديد من`,
    action: "view_coupon",
  };
};

export const NewProviderMessage = (provider) => {
  return {
    enTitle: `new provider🥳🥳 ${provider.name}`,
    arTitle: `مقدم خدمه جديد 🥳🥳 ${provider.name}`,
    enBody: `a new provider has just joined coupons ${provider.name}`,
    arBody: `الي كوبونات${provider.name} انضم`,
    action: "view_provider",
  };
};

export const NotifiedEnum = [
  "PROVIDERS",
  "CUSTOMERS",
  "ADMINS",
  "ALL",
  "CUSTOMERS&ADMINS",
];
