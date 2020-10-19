import boom from "@hapi/boom";
import { BazarModule } from "../../../ProviderManagement/modules/bazar";
import { AdsModule } from "../../../ProviderManagement/modules/ads";
import { AdminModule } from "../../modules/admin";
import { OrderModule } from "../../../Purchasing/modules/order";
import {} from "../../models/appCridit";
import { AdsPackagesModule } from "../../modules/adsPackages";

const AdminBazarsController = {
  async getBazars(req, res, next) {
    let accepted = req.query.accepted,
      limit = parseInt(req.query.limit),
      skip = parseInt(req.query.skip),
      type = req.query.type || null,
      bazars = await BazarModule.adminBazarsQuery(accepted, type, limit, skip);

    bazars = bazars.map((bazar) => {
      bazar = bazar.toObject();

      bazar.districtId = bazar.districtId.map((dis) => {
        return dis.toString();
      });

      bazar.resources.map((resource) => {
        return delete resource.password;
      });

      bazar.cityId.districts = bazar.cityId.districts.filter((dist) => {
        return bazar.districtId.includes(dist._id.toString());
      });

      delete bazar.districtId;
      delete bazar.provider.password;
      return bazar;
    });

    res.send({
      isSuccessed: true,
      data: bazars,
      error: null,
    });
  },
  async getAds(req, res, next) {
    let date = req.query.date || undefined,
      isPaid = req.query.isPaid || undefined,
      isAccepted = req.query.isAccepted || undefined,
      bazarId = req.query.bazar || undefined;

    if (bazarId) {
      let bazar = await BazarModule.getById(bazarId);
      if (!bazar) {
        let lang = req.headers.lang || "ar",
          errMsg = lang == "en" ? "Bazar not found" : "المتجر غير موجود";
        return next(boom.unauthorized(errMsg));
      }
    }

    let ads = await AdsModule.getAds(date, isPaid, isAccepted, bazarId, true);

    res.status(200).send({
      isSuccessed: true,
      data: ads,
      error: null,
    });
  },
  async bazarVerification(req, res, next) {
    let bazarId = req.params.id;
    let isAccepted = req.body.isAccepted || false;
    let bazar = await BazarModule.bazarVerification(bazarId, isAccepted);
    res.status(200).send({
      isSuccessed: true,
      data: bazar,
      error: null,
    });
  },

  async adsVerification(req, res, next) {
    let adId = req.params.id;
    let isAccepted = req.body.isAccepted;
    let note = req.query.note || null;
    let ad = await AdsModule.getById(adId);
    if (!ad) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Ad not found" : "الاعلان  غير موجود";
      return next(boom.unauthorized(errMsg));
    }

    let pack = await AdsPackagesModule.getById(ad.pakageId);
    if (!pack) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Package not found" : "الحزمة غير موجودة";
      return next(boom.unauthorized(errMsg));
    }
    if (!isAccepted) {
      if (!note) {
        let lang = req.headers.lang || "ar",
          errMsg = lang == "en" ? "not must be added" : "يجب اضافة سبب الرفض";
        return next(boom.unauthorized(errMsg));
      }
      ad.note = note;
    } else {
      ad.isAccepted = true;
      ad.startDate = new Date();
      ad.endDate = new Date(
        new Date().setDate(new Date().getDate() + parseInt(pack.totalDayes))
      );
      ad.isPaid = true;
    }
    ad = await ad.save();

    res.status(200).send({
      isSuccessed: true,
      data: ad,
      error: null,
    });
  },

  async getStatistics(req, res, next) {
    console.log("ok");
    let bazar = await AdminModule.getStatistics();
    res.status(200).send({
      isSuccessed: true,
      data: bazar,
      error: null,
    });
  },

  async getClients(req, res, next) {
    console.log("ok");
    let clients = await AdminModule.getAllClients();
    for (let i = 0; i < clients.length; i++) {
      clients[i] = await clients[i]
        .populate("favProducts.bazar", "name")
        .execPopulate();
      clients[i] = clients[i].toObject();
      delete clients[i].password;
    }
    res.status(200).send({
      isSuccessed: true,
      data: clients,
      error: null,
    });
  },

  async getOrderesList(req, res, next) {
    let bazar = req.query.bazar || null,
      state = req.query.state || null,
      clientId = req.query.clientId || null;

    let orders = await OrderModule.getOrders(
      clientId,
      state,
      bazar,
      true,
      true
    );

    for (let i = 0; i < orders.length; i++) {
      orders[i] = await orders[i]
        .populate("bazar.provider")
        .populate("bazar.cityId")
        .populate("bazar.resources")
        .populate("clientId.favProducts")
        .populate("clientId.favCoupons")
        .execPopulate();

      orders[i].bazar.districtId = orders[i].bazar.districtId.map((dis) => {
        return dis.toString();
      });

      orders[i].bazar.cityId.districts = orders[
        i
      ].bazar.cityId.districts.filter((dist) => {
        //console.log(dist._id);
        // console.log(provider.bazar.districtId);
        return orders[i].bazar.districtId.includes(dist._id.toString());
      });

      delete orders[i].bazar.districtId;
    }
    return res.status(201).send({
      isSuccessed: true,
      data: orders || [],
      error: null,
    });
  },

  async addPaymentWay(req, res, next) {
    let payment = req.body;

    if (req.file) {
      console.log("file: ", req.file);
      let imgURL =
        "http://api.bazar.alefsoftware.com/api/v1/purchasing-management/orders/payments/payments-images/" +
        req.file.filename;
      payment.imgURL = imgURL;
    }
    let addPay = await AdminModule.addPaymentWay(payment);

    if (addPay.err) {
      return res.send({
        isSuccessed: false,
        data: null,
        error: addPay.err,
      });
    }
    return res.status(201).send({
      isSuccessed: true,
      data: addPay.payment,
      error: null,
    });
  },

  async getPaymentWay(req, res, next) {
    let isAd = req.query.isAd || false;
    let getPay = await AdminModule.getAvailPayment(isAd);
    return res.status(201).send({
      isSuccessed: true,
      data: getPay,
      error: null,
    });
  },

  async switchPaymentWay(req, res, next) {
    let id = req.params.id;
    let switchPay = await AdminModule.switchPayment(id);
    return res.status(201).send({
      isSuccessed: true,
      data: switchPay,
      error: null,
    });
  },

  async getAdById(req, res, next) {
    let id = req.params.id;
    let add = await AdsModule.getById(id);
    return res.status(201).send({
      isSuccessed: true,
      data: add,
      error: null,
    });
  },

  async deleteAllPaymentWay(req, res, next) {
    let id = req.params.id;
    let deletePay = await AdminModule.deleteAllPayment();
    return res.status(201).send({
      isSuccessed: true,
      data: deletePay,
      error: null,
    });
  },
};

export { AdminBazarsController };
